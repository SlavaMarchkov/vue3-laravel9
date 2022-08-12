import { inject, reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { AbilityBuilder, Ability } from "@casl/ability";
import { ABILITY_TOKEN } from "@casl/vue";

const user = reactive({
    name: "",
    email: "",
});

export default function useAuth() {
    const processing = ref(false);
    const validationErrors = ref({});
    const router = useRouter();
    const swal = inject("$swal");
    const ability = inject(ABILITY_TOKEN);

    const loginForm = reactive({
        email: "",
        password: "",
        remember: false,
    });

    const submitLogin = async () => {
        if (processing.value) return;

        processing.value = true;
        validationErrors.value = {};

        axios
            .post("/login", loginForm)
            .then(async (response) => {
                loginUser(response);
            })
            .catch((err) => {
                if (err.response?.data) {
                    validationErrors.value = err.response.data.errors;
                }
            })
            .finally(() => {
                processing.value = false;
            });
    };

    const loginUser = async (response) => {
        user.name = response.data.name;
        user.email = response.data.email;
        localStorage.setItem("loggedIn", JSON.stringify(true));
        await getAbilities();
        await router.push({ name: "posts.index" });
    };

    const getUser = () => {
        axios.get("/api/user").then((response) => {
            loginUser(response);
        });
        /* .catch((err) => {
                throw err;
            }) */
    };

    const logout = async () => {
        if (processing.value) return;

        processing.value = true;

        axios
            .post("/logout")
            .then((response) => router.push({ name: "login" }))
            .catch((err) => {
                swal({
                    icon: "error",
                    title: err.response.status,
                    text: err.response.statusText,
                });
            })
            .finally(() => {
                processing.value = false;
            });
    };

    const getAbilities = async () => {
        axios
            .get("/api/abilities")
            .then((response) => {
                const permissions = response.data;
                const { can, rules } = new AbilityBuilder(Ability);

                can(permissions);

                ability.update(rules);
            })
            .catch()
            .finally();
    };

    return {
        processing,
        validationErrors,
        loginForm,
        submitLogin,
        user,
        getUser,
        logout,
        getAbilities,
    };
}
