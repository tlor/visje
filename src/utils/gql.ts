const correctFormats = (obj: any) => {
  const objKeys = Object.keys(obj);
  objKeys.forEach((key) => {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString()
    }if (typeof obj[key] == "string" && obj[key] === "null") {
      obj[key] = null;
    } else if (obj[key] && typeof obj[key] == "object") {
      correctFormats(obj[key]);
    }
  });
};

export function resolveReferenceObjectToId(
  obj: any,
  resolveReferenceObjectsToId = false
) {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      // In case of an array with reference objects that match [{ __typename: "xxx", _id: "xxx" }]
      if (
        Array.isArray(obj[key]) &&
        obj[key].length &&
        (Object.keys(obj[key][0]).length == 2 || resolveReferenceObjectsToId)
      ) {
        obj[key] = obj[key].map((d) => d._id);
      } else {
        // In case of a reference to object that match { __typename: "xxx", _id: "xxx" }
        if (
          obj[key] &&
          (Object.keys(obj[key]).length == 2 || resolveReferenceObjectsToId) &&
          Object.keys(obj[key]).includes("_id")
        ) {
          obj[key] = obj[key]._id;
        }
      }
    }
  }
  return obj;
}

export const deleteTypeNames = (object: any) => {
  if (object.__typename) delete object.__typename;
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const element = object[key];
      if (element.__typename) delete element.__typename;
    }
  }
  return object;
};

export const stripResult = (
  result: any,
  resolveReferenceObjectsToId = false
) => {
  // TODO: make graphql objects lean
  result = result[Object.keys(result)[0]];
  if (typeof result === "object") {
    if (Array.isArray(result)) {
      result = [...result];
      for (const [index, item] of result.entries()) {
        // TODO: Writing good queries removes the need for this
        result[index] = resolveReferenceObjectToId(
          { ...item },
          resolveReferenceObjectsToId
        );
      }
    } else {
      result = { ...result };
      resolveReferenceObjectToId(result, resolveReferenceObjectsToId);
    }
  }
  return result;
};

const isReference = (model) => {
  return typeof model === "object" ? !!model._id : false;
};

export const filterModelByFields = (
  newModel: any,
  model: any,
  fields: string[] = []
) => {
  for (const field of fields) {
    if (field.includes(".")) {
      const keys = field.split(".");
      const rootKey = keys.shift();
      if (Object.prototype.hasOwnProperty.call(model, rootKey)) {
        newModel[rootKey] = filterModelByFields({}, model[rootKey], [
          keys.join("."),
        ]);
      }
    } else if (Object.prototype.hasOwnProperty.call(model, field)) {
      newModel[field] = model[field];
    }
  }
  return newModel;
};

export const parseReferences = (obj: any) => {
  const objKeys = Object.keys(obj);
  objKeys.forEach((key) => {    
    if(key === "authors") console.log(obj[key]);
    if (obj[key] && typeof obj[key] == "object" && !Array.isArray(obj[key])) {
      if (isReference(obj)) {
        obj[key] = obj[key]._id;
      } else {
        parseReferences(obj[key]);
      }
    } else if(Array.isArray(obj[key])) {
      if (obj[key].length && isReference(obj[key][0])) {
        obj[key] = obj[key].map(d => d?._id)
      }
    }
  });
};

export const prepareModel = (model: any, fields: string[] = []) => {
  model = { ...model };
  delete model.__typename;
  if(model.id) delete model.id;  
  if (model.fullName) delete model.fullName;
  if (fields.length) {
    model = filterModelByFields(
      {
        _id: model._id,
      },
      model,
      fields
    );
  }
  if (model.password) delete model.password;
  correctFormats(model);
  parseReferences(model);
  
  if(model._id) delete model._id;
  return model;
};
