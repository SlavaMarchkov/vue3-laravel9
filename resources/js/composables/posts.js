import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default function usePosts() {
    const post = ref({});
    const posts = ref({});
    const router = useRouter();
    const validationErrors = ref({});
    const isLoading = ref(false);
    const isFiltered = ref(false);
    const swal = inject("$swal");

    const getPosts = async (
        page = 1,
        search_category = "",
        search_id = "",
        search_title = "",
        search_content = "",
        search_global = "",
        order_column = "created_at",
        order_direction = "desc"
    ) => {
        axios
            .get(
                "/api/posts?page=" +
                    page +
                    "&search_category=" +
                    search_category +
                    "&search_id=" +
                    search_id +
                    "&search_title=" +
                    search_title +
                    "&search_content=" +
                    search_content +
                    "&search_global=" +
                    search_global +
                    "&order_column=" +
                    order_column +
                    "&order_direction=" +
                    order_direction
            )
            .then((response) => {
                isFiltered.value =
                    search_category !== "" ||
                    search_id !== "" ||
                    search_title !== "" ||
                    search_content !== "" ||
                    search_global !== ""
                        ? true
                        : false;
                posts.value = response.data;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getPost = async (id) => {
        axios
            .get("/api/posts/" + id)
            .then((response) => {
                post.value = response.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const storePost = async (post) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        let serializedPost = new FormData();
        for (let item in post) {
            if (post.hasOwnProperty(item)) {
                serializedPost.append(item, post[item]);
            }
        }

        axios
            .post("/api/posts", serializedPost)
            .then(() => {
                router.push({ name: "posts.index" });
                swal({
                    icon: "success",
                    title: "Post saved successfully",
                });
            })
            .catch((err) => {
                if (err.response?.data) {
                    validationErrors.value = err.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const updatePost = async (post) => {
        if (isLoading.value) return;

        isLoading.value = true;
        validationErrors.value = {};

        axios
            .put("/api/posts/" + post.id, post)
            .then(() => {
                router.push({ name: "posts.index" });
                swal({
                    icon: "success",
                    title: "Post updated successfully",
                });
            })
            .catch((err) => {
                if (err.response?.data) {
                    validationErrors.value = err.response.data.errors;
                }
            })
            .finally(() => (isLoading.value = false));
    };

    const deletePost = async (id) => {
        swal({
            title: "Are you sure?",
            text: "You won't be able to revert this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            confirmButtonColor: "#ef4444",
            timer: 10000,
            timerProgressBar: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete("/api/posts/" + id)
                    .then(() => {
                        getPosts();
                        router.push({ name: "posts.index" });
                        swal({
                            icon: "success",
                            title: "Post deleted successfully",
                        });
                    })
                    .catch((err) => {
                        swal({
                            icon: "error",
                            title: "Somthing went wrong",
                        });
                    });
            }
        });
    };

    return {
        post,
        posts,
        getPost,
        getPosts,
        storePost,
        updatePost,
        deletePost,
        validationErrors,
        isLoading,
        isFiltered,
    };
}
