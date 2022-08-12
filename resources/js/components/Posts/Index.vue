<template>
    <div class="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
        <div class="min-w-full align-middle">
            <div class="mb-4 grid lg:grid-cols-4 gap-4">
                <input
                    v-model="search_global"
                    type="text"
                    placeholder="Search..."
                    class="inline-block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <table class="min-w-full divide-y divide-gray-200 border">
                <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <input
                                v-model="search_id"
                                type="text"
                                class="inline-block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Filter by ID"
                            />
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <input
                                v-model="search_title"
                                type="text"
                                class="inline-block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Filter by Title"
                            />
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <select
                                v-model="search_category"
                                class="inline-block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="" selected>
                                    -- all categories --
                                </option>
                                <option
                                    v-for="category in categories"
                                    :key="category.id"
                                    :value="category.id"
                                >
                                    {{ category.name }}
                                </option>
                            </select>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <input
                                v-model="search_content"
                                type="text"
                                class="inline-block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="Filter by Content"
                            />
                        </th>
                        <th colspan="2" class="px-6 py-3 bg-gray-50 text-left">
                            <button
                                v-show="isFiltered"
                                @click="clearFilters"
                                class="mt-1 py-2 px-3 bg-blue-600 text-white rounded w-full"
                            >
                                Clear filters
                            </button>
                        </th>
                    </tr>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <div
                                @click="updateOrdering('id')"
                                class="flex flex-row items-center justify-between cursor-pointer"
                            >
                                <div
                                    class="leading-4 font-medium tracking-wider"
                                    :class="{
                                        'font-bold text-blue-600':
                                            orderColumn === 'id',
                                    }"
                                >
                                    ID
                                </div>
                                <div class="select-none">
                                    <span
                                        :class="{
                                            'text-blue-600':
                                                orderDirection === 'asc' &&
                                                orderColumn === 'id',
                                            hidden:
                                                orderDirection !== '' &&
                                                orderDirection !== 'asc' &&
                                                orderColumn === 'id',
                                            'opacity-25': orderColumn !== 'id',
                                        }"
                                        >&uarr;</span
                                    >
                                    <span
                                        :class="{
                                            'text-blue-600':
                                                orderDirection === 'desc' &&
                                                orderColumn === 'id',
                                            hidden:
                                                orderDirection !== '' &&
                                                orderDirection !== 'desc' &&
                                                orderColumn === 'id',
                                            'hidden opacity-25':
                                                orderColumn !== 'id',
                                        }"
                                        >&darr;</span
                                    >
                                </div>
                            </div>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <div
                                @click="updateOrdering('title')"
                                class="flex flex-row items-center justify-between cursor-pointer"
                            >
                                <div
                                    class="leading-4 font-medium tracking-wider"
                                    :class="{
                                        'font-bold text-blue-600':
                                            orderColumn === 'title',
                                    }"
                                >
                                    Title
                                </div>
                                <div class="select-none">
                                    <span
                                        :class="{
                                            'text-blue-600':
                                                orderDirection === 'asc' &&
                                                orderColumn === 'title',
                                            hidden:
                                                orderDirection !== '' &&
                                                orderDirection !== 'asc' &&
                                                orderColumn === 'title',
                                            'opacity-25':
                                                orderColumn !== 'title',
                                        }"
                                        >&uarr;</span
                                    >
                                    <span
                                        :class="{
                                            'text-blue-600':
                                                orderDirection === 'desc' &&
                                                orderColumn === 'title',
                                            hidden:
                                                orderDirection !== '' &&
                                                orderDirection !== 'desc' &&
                                                orderColumn === 'title',
                                            'hidden opacity-25':
                                                orderColumn !== 'title',
                                        }"
                                        >&darr;</span
                                    >
                                </div>
                            </div>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span class="leading-4 font-medium">Category</span>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span class="leading-4 font-medium">Content</span>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <div
                                @click="updateOrdering('created_at')"
                                class="flex flex-row items-center justify-between cursor-pointer"
                            >
                                <div
                                    class="leading-4 font-medium tracking-wider"
                                    :class="{
                                        'font-bold text-blue-600':
                                            orderColumn === 'created_at',
                                    }"
                                >
                                    Created at
                                </div>
                                <div class="select-none">
                                    <span
                                        :class="{
                                            'text-blue-600':
                                                orderDirection === 'asc' &&
                                                orderColumn === 'created_at',
                                            hidden:
                                                orderDirection !== '' &&
                                                orderDirection !== 'asc' &&
                                                orderColumn === 'created_at',
                                            'opacity-25':
                                                orderColumn !== 'created_at',
                                        }"
                                        >&uarr;</span
                                    >
                                    <span
                                        :class="{
                                            'text-blue-600':
                                                orderDirection === 'desc' &&
                                                orderColumn === 'created_at',
                                            hidden:
                                                orderDirection !== '' &&
                                                orderDirection !== 'desc' &&
                                                orderColumn === 'created_at',
                                            'hidden opacity-25':
                                                orderColumn !== 'created_at',
                                        }"
                                        >&darr;</span
                                    >
                                </div>
                            </div>
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left">
                            <span class="leading-4 font-medium">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 divide-solid">
                    <tr v-for="post in posts.data" :key="post.id">
                        <td
                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900"
                        >
                            {{ post.id }}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900"
                        >
                            {{ post.title }}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900"
                        >
                            {{ post.category }}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900"
                        >
                            {{ post.content }}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900"
                        >
                            {{ post.created_at }}
                        </td>
                        <td
                            class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900"
                        >
                            <router-link
                                :to="{
                                    name: 'posts.edit',
                                    params: { id: post.id },
                                }"
                                >Edit</router-link
                            >
                            <a
                                v-if="can('posts.delete')"
                                href="#"
                                @click.prevent="deletePost(post.id)"
                                class="ml-2"
                                >Delete</a
                            >
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination
                :data="posts"
                @pagination-change-page="
                    (page) =>
                        getPosts(
                            page,
                            search_category,
                            search_id,
                            search_title,
                            search_content,
                            search_global,
                            orderColumn,
                            orderDirection
                        )
                "
            />
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import usePosts from "../../composables/posts";
import useCategories from "../../composables/categories";
import { useAbility } from "@casl/vue";

export default {
    name: "Index",
    setup() {
        const search_category = ref("");
        const search_id = ref("");
        const search_title = ref("");
        const search_content = ref("");
        const search_global = ref("");
        const orderColumn = ref("created_at");
        const orderDirection = ref("desc");

        const { posts, isFiltered, getPosts, deletePost } = usePosts();
        const { categories, getCategories } = useCategories();

        const { can } = useAbility();

        onMounted(() => {
            getPosts();
            getCategories();
        });

        const clearFilters = () => {
            getPosts(
                1,
                (search_id.value = ""),
                (search_category.value = ""),
                (search_title.value = ""),
                (search_content.value = ""),
                (search_global.value = "")
            );
        };

        watch(search_category, (current, previous) => {
            getPosts(
                1,
                current,
                search_id.value,
                search_title.value,
                search_content.value,
                search_global.value
            );
        });

        watch(search_id, (current, previous) => {
            getPosts(
                1,
                search_category.value,
                current,
                search_title.value,
                search_content.value,
                search_global.value
            );
        });

        watch(search_title, (current, previous) => {
            getPosts(
                1,
                search_category.value,
                search_id.value,
                current,
                search_content.value,
                search_global.value
            );
        });

        watch(search_content, (current, previous) => {
            getPosts(
                1,
                search_category.value,
                search_id.value,
                search_title.value,
                current,
                search_global.value
            );
        });

        watch(search_global, (current, previous) => {
            getPosts(
                1,
                search_category.value,
                search_id.value,
                search_title.value,
                search_content.value,
                current
            );
        });

        const updateOrdering = (column) => {
            orderColumn.value = column;
            orderDirection.value =
                orderDirection.value === "asc" ? "desc" : "asc";
            getPosts(
                1,
                search_category.value,
                search_id.value,
                search_title.value,
                search_content.value,
                search_global.value,
                orderColumn.value,
                orderDirection.value
            );
        };

        return {
            posts,
            categories,
            search_category,
            search_id,
            search_title,
            search_content,
            search_global,
            orderColumn,
            orderDirection,
            getPosts,
            deletePost,
            updateOrdering,
            clearFilters,
            isFiltered,
            can,
        };
    },
};
</script>

<style>
.pagination {
    display: flex;
    justify-content: center;
    margin: 15px 0;
}
li.page-item {
    margin: 0 3px;
}
a.page-link {
    border-radius: 50%;
    display: block;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    place-items: center;
    transition: all 0.18s ease-in-out;
}
a.page-link:hover {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(1.2);
}
.active a.page-link {
    background: rgba(0, 0, 0, 0.1);
}
a.page-link span.sr-only {
    display: none;
}
</style>
