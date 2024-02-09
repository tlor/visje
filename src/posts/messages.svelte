<script>
  import { createEventDispatcher } from "svelte";
  import { postMany, postCreateOne, postRemoveById, postUpdateById } from "@models/Post/post.gql";
  import { stripResult, prepareModel } from "@utils/gql";
  import { query, mutation } from "svelte-apollo";
  import EditMessage from "@components/Posts/EditMessage.svelte";
  import { session, currentSession } from "@root/_store";
  import Post from "@models/Post/Post";
  import { writable } from "svelte/store";
  import Loading from "@components/Elements/Loading.svelte";
  import Message from "@components/Posts/Message.svelte";
  import { isAdmin, isAuthor } from "@services/roles";
  import { stripHtml } from "string-strip-html";

  export let filter = {};
  export let posts = [];
  export let post = new Post();

  const dispatch = createEventDispatcher();

  const postsQuery = query(postMany, {
    variables: { filter },
    fetchPolicy: "network-only",
  });
  const postCreateQuery = mutation(postCreateOne);
  const postUpdateQuery = mutation(postUpdateById);
  const postRemoveQuery = mutation(postRemoveById);

  let editMessage = writable({});
  let createMessage = true;

  const create = async () => {
    post.author = $currentSession.member._id;
    post.pinned = true;
    const result = await postCreateQuery({
      variables: { record: prepareModel(post) },
    }).catch((err) => dispatch("error", err));
    dispatch("create", { id: stripResult(result.data).recordId, type: "Post" });
    close();
    return result;
  };

  export const update = async (post) => {
    const { title, content } = $editMessage;
    post.title = stripHtml(title).result;
    post.content = content;
    const result = await postUpdateQuery({
      variables: { id: post._id, record: prepareModel(post) },
    }).catch((err) => dispatch("error", err));
    dispatch("update", { id: stripResult(result.data).recordId, type: "Post" });
    close();
    return result;
  };

  export const remove = async (_) => {
    const result = await postRemoveQuery({ variables: { id: id } }).catch((err) => dispatch("error", err));
    dispatch("remove", { id: stripResult(result.data).recordId, type: "Post" });
    return result;
  };

  const close = () => {
    editMessage.set({});
  };

  $: if ($postsQuery.data) {
    if (!posts?.length) posts = stripResult($postsQuery.data);
  } else if ($postsQuery.error) {
    dispatch("error", $postsQuery.error);
  }
</script>

<div class="position-relative">
  {#if $postsQuery.loading}
    <Loading />
  {:else if $postsQuery.error}
    <div class="container">
      <span>Oeps.. geen <b>mededelingen</b> gevonden 🫠</span>
    </div>
  {:else}
    <div id="carousel-testimonials" class="carousel slide carousel-team">
      <div class="carousel-inner py-4">
        {#each posts as post, i}
          {#if $editMessage?._id == post._id}
            <div class="carousel-item active">
              <div class="container">
                <EditMessage
                  post={$editMessage}
                  on:save={(e) => {
                    e.detail?._id ? update(e.detail) : create(e.detail);
                  }}
                  on:close={close}
                />
              </div>
            </div>
          {:else}
            <div class="carousel-item" class:active={i === 0}>
              <div class="container">
                <Message
                  {post}
                  author={isAuthor(post, $currentSession, session)}
                  on:navigateUser={() => {}}
                  on:edit={({ detail }) => {
                    editMessage.set({ ...detail });
                  }}
                />
              </div>
            </div>
          {/if}
        {:else}
          <!-- TODO: Add new message -->
        {/each}
      </div>
    </div>
    {#if posts.length > 1}
      <a class="tw-max-h-5 top-50 carousel-control-prev text-dark" href="#carousel-testimonials" role="button" data-bs-slide="prev">
        <i class="fas fa-chevron-left" />
        <span class="sr-only">Previous</span>
      </a>
      <a class="tw-max-h-5 top-50 carousel-control-next text-dark" href="#carousel-testimonials" role="button" data-bs-slide="next">
        <i class="fas fa-chevron-right" />
        <span class="sr-only">Next</span>
      </a>
    {/if}
  {/if}
</div>
