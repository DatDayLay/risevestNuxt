<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";


import logo from "../public/logo-main.svg";



type Feedback = {
  id?: string;
  name: string;
  email: string;
  message: string;
  number: string;
  type: "bug" | "feature" | "other";
};

const FEEDBACK_TYPES = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "other", label: "Other" },
];
const API_URL = "https://rise-frontend-test-api.developer-a6a.workers.dev/";
const FEEDBACKS_PER_PAGE = 12;

const form = reactive<Feedback>({
  name: "",
  email: "",
  message: "",
  number: "",
  type: "bug",
});
const feedbacks = ref<Feedback[]>([]);
const filter = ref<"" | "bug" | "feature" | "other">("");
const isModalOpen = ref(false); 
const thankYou = ref(false); 
const currentPage = ref(1);

const getInitials = (nameString: string) => {
  if (!nameString) return "";
  const words = nameString.split(" ");
  const initials = words
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return initials;
};

const getRandomHexColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

const setFilter = (val: "" | "bug" | "feature" | "other") => {
  filter.value = val;
};

const search = ref("");

const fetchFeedbacks = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    feedbacks.value = data.reverse();
  } catch (err) {
    console.log(err);
  }
};

const filteredFeedbacks = computed(() =>
  feedbacks.value.filter(
    (fb) =>
      (filter.value ? fb.type === filter.value : true) &&
      (search.value
        ? fb.message.toLowerCase().includes(search.value.toLowerCase()) ||
          fb.name.toLowerCase().includes(search.value.toLowerCase())
        : true)
  )
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredFeedbacks.value.length / FEEDBACKS_PER_PAGE))
);

const paginatedFeedbacks = computed(() =>
  filteredFeedbacks.value.slice(
    (currentPage.value - 1) * FEEDBACKS_PER_PAGE,
    currentPage.value * FEEDBACKS_PER_PAGE
  )
);

watch([filter, search], () => {
  currentPage.value = 1;
});

const isFormValid = computed(() => form.name && form.email && form.message);

const handleSubmit = async () => {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    form.name = "";
    form.email = "";
    form.message = "";
    form.number = "";
    form.type = "bug";
    isModalOpen.value = false; 
    thankYou.value = true; 
    await fetchFeedbacks();
    currentPage.value = 1;
  } catch (err) {
    console.log(err);
  }
};


const openFeedbackModal = () => {
  isModalOpen.value = true;
};

const closeFeedbackModal = () => {
  isModalOpen.value = false;
};

const closeThankYouModal = () => {
  thankYou.value = false;
};

onMounted(() => {
  fetchFeedbacks();
});
</script>

<template>
  <div class="bg-[#f8f8f8] font-sans flex flex-col  w-full min-h-[100vh]">
    <nav class="md:px-8 md:py-4 p-4 bg-white">
      <NuxtImg :src="logo" width="97" height="52" alt="" />
    </nav>

    <section class="flex flex-col w-full  md:w-fit md:px-8 px-4 py-4 gap-2">
      <h3
        class="font-normal font-jost text-lg w-full  md:w-fit md:text-[32px] text-[24px]"
      >
        Got a complaint or feedback?
      </h3>
      <div class="flex w-full">
        <aside class="w-[20%] items-center flex">
          <NuxtImg src="../assets/Avatar.png" width="30" height="30" alt="" />
          <NuxtImg
            class="-ml-3"
            src="../assets/Headshot of a black young man.png"
            width="30"
            height="30"
            alt=""
          />
          <NuxtImg
            class="-ml-3"
            src="../assets/Headshot of a black young woman with a mild smile.png"
            width="30"
            height="30"
            alt=""
          />
          <NuxtImg
            class="-ml-3"
            src="../assets/Headshot of a black young woman with afro hair.png"
            width="30"
            height="30"
            alt=""
          />
        </aside>
        <p class="items-center w-full font-raleway font-normal text-sm text-[#555B64] flex">
          Our support team is ready to listen and resolve.
        </p>
      </div>
    </section>

    <section
      class="flex justify-between w-full items-start lg:items-center md:px-8 px-4 py-4 gap-4 flex-col lg:flex-row"
    >
      <aside
        class="flex lg:w-[60%] font-raleway xl:w-[50%] 2xl:w-[35%] justify-between overflow-x-auto space-x-3  w-full md:w-[80%]   items-center"
      >
        <button
          @click="setFilter('')"
          :class="[
            'px-6 py-2 font-medium cursor-pointer text-sm border-2 outline-0 rounded-xl transition-colors duration-200',
            filter === ''
              ? 'bg-[#EDFFFF] border-[#9FDCE1]'
              : 'bg-white border-[#EAECF0]  hover:border-[#9FDCE1]',
          ]"
        >
          All Feedbacks
        </button>
        <button
          @click="setFilter('bug')"
          :class="[
            'px-6 py-2 font-medium text-sm cursor-pointer border-2 outline-0 rounded-xl transition-colors duration-200',
            filter === 'bug'
              ? 'bg-[#EDFFFF] border-[#9FDCE1]'
              : 'bg-white border-[#EAECF0]  hover:border-[#9FDCE1]',
          ]"
        >
          Bugs
        </button>
        <button
          @click="setFilter('feature')"
          :class="[
            'px-6 py-2 font-medium cursor-pointer text-sm border-2 outline-0 rounded-xl transition-colors duration-200',
            filter === 'feature'
              ? 'bg-[#EDFFFF] border-[#9FDCE1]'
              : 'bg-white border-[#EAECF0]  hover:border-[#9FDCE1]',
          ]"
        >
          Features
        </button>
        <button
          @click="setFilter('other')"
          :class="[
            'px-6 py-2 font-medium cursor-pointer text-sm lg:text-sm border-2 outline-0 rounded-xl transition-colors duration-200',
            filter === 'other'
              ? 'bg-[#EDFFFF] border-[#9FDCE1]'
              : 'bg-white border-[#EAECF0]  hover:border-[#9FDCE1]',
          ]"
        >
          Other
        </button>
      </aside>

      <button
        @click="openFeedbackModal"
        class="group flex items-center gap-1 p-2.5 text-base cursor-pointer rounded-3xl outline-0 bg-[#006D79] text-white border-[#006D79] border-2 hover:bg-white hover:text-[#006D79] hover:border-[#006D79] hover:border-2"
      >
        <Icon name="i-tdesign:add" class="text-white font-raleway font-normal text-xl group-hover:text-[#006D79]" />
        Submit New Feedback
      </button>
    </section>

    <section v-if="filteredFeedbacks.length === 0" class="w-full flex mt-[10%]">
      <p class="text-[#555B64] flex text-xl font-sans items-center mx-auto">
        Feedbacks Loading
         <Icon name="i-tdesign:loading" class="text-[#006D79] text-4xl" />
      </p>
    </section>
    <section v-else class="relative">
      <div
        class="grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 md:grid-cols-2 p-4 place-items-center w-full gap-2"
      >
        <div
          v-for="(fb, id) in paginatedFeedbacks"
          :key="id"
          class="bg-white lg:w-[90%] w-[80%] md:w-[80%] flex flex-col gap-3 p-4 rounded-2xl border-[1px] border-[#EAECF0]"
        >
          <aside class="flex w-full gap-2 items-center">
            <p
              class="w-10 h-10 font-semibold font-jost rounded-full text-lg text-center p-2 items-center bg-gray-200"
              :style="{ color: getRandomHexColor() }"
            >
              {{ getInitials(fb.name) }}
            </p>
            <h4 class="text-xl font-semibold font-jost ">{{ fb.name }}</h4>
          </aside>
          <p class="flex font-raleway font-normal text-[#555B64] gap-2 items-center">
            <Icon name="i-tdesign:mail-filled" class="text-[#c9cdd3] text-lg" />
            {{ fb.email }}
          </p>
          <p class="flex font-raleway font-normal text-[#555B64] gap-2 items-center">
            <Icon name="i-tdesign:call" class="text-[#c9cdd3] text-lg" />
            {{ fb.number ? fb.number : "n/a" }}
          </p>
          <p class="flex font-raleway font-normal text-[#555B64] gap-2 items-center">
            <Icon name="i-tdesign:file-1" class="text-[#c9cdd3] text-lg" />
            {{ fb.type }}
          </p>
          <p class="text-[#555B64] px-6">{{ fb.message }}</p>
        </div>
      </div>
      <div
        v-if="totalPages > 1"
        class="flex justify-between items-center px-4 py-4 w-full left-0 bottom-0"
      >
        <div class="text-gray-500 text-sm font-medium">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-3 rounded-full font-semibold flex justify-center items-center w-10 h-10',
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#006D79] text-white cursor-pointer hover:bg-[#00545f]',
            ]"
          >
            <Icon name="i-tdesign:arrow-left"/>
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-3 rounded-full font-semibold w-10 h-10 flex justify-center items-center',
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#006D79] text-white cursor-pointer hover:bg-[#00545f]',
            ]"
          >
            <Icon name="i-tdesign:arrow-right"/>
          </button>
        </div>
      </div>
    </section>
    
      <Modal
        v-show="isModalOpen"
        :isVisible="isModalOpen"
        @close="closeFeedbackModal"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-scroll lg:overflow-hidden bg-black/50"
      >
       <div class="bg-white rounded-xl w-[95%] max-w-lg lg:w-full py-4 sm:py-6 lg:py-8 relative mx-auto">
         <h3 class="text-lg  font-jost font-semibold ml-4 mt-2">
          What would you like to bring to our attention?
        </h3>
        <p class="text-[#555B64] font-raleway font-normal text-sm ml-4 mt-1">
          Kindly fill the details below to submit.
        </p>
        <form
          class="w-full mt-8 bg-[#f8f8f8] border-y-2 px-4 py-8 md:gap-4 gap-2 flex flex-col border-y-[#EAECF0]"
          @submit.prevent="handleSubmit"
        >
          <input
            type="text"
            placeholder="Full name"
            required
            class="rounded-lg font-medium p-4 outline-none border-[#EAECF0] border-[1px]"
            v-model="form.name"
          />

          <div
            class="flex items-center px-3 py-2 w-full rounded-lg p-2 outline-none border-[#EAECF0] border-[1px]"
          >
          <Icon name="i-tdesign:mail-filled" class="text-gray-400 text-lg mr-2 border-r-2 border-r-[#EAECF0]" />
            <input
              type="email"
              placeholder="Enter email"
              class="flex-1 outline-none font-medium py-2 px-2"
              v-model="form.email"
            />
          </div>
          <div
            class="flex items-center px-3 py-2 w-full rounded-lg p-2 outline-none border-[#EAECF0] border-[1px]"
          >
            <Icon name="i-tdesign:call"
              class="text-gray-400 text-lg mr-2 border-r-2 border-r-[#EAECF0]"
            />
            <input
              type="text"
              placeholder="Phone Number"
              class="flex-1 font-medium outline-none py-2 px-2"
              v-model="form.number"
            />
          </div>
          <select
            class="rounded-lg p-4 font-medium outline-none border-[#EAECF0] border-[1px]"
            v-model="form.type"
          >
            <option v-for="t in FEEDBACK_TYPES" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
          <textarea
            placeholder="Enter feedback message..."
            required
            class="rounded-lg font-medium p-4 outline-none border-[#EAECF0] border-[1px] resize-none"
            v-model="form.message"
          />

          <aside class="flex justify-between w-full gap-3 items-center">
            <button
              type="button"
              @click="closeFeedbackModal"
              class="bg-[#EAECF0] text-[#006D79] w-[50%] p-3 rounded-3xl hover:bg-[#dfe1e4] cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'w-[50%] p-3 rounded-3xl font-semibold transition-all',
                isFormValid
                  ? 'bg-[#006D79] text-white cursor-pointer hover:bg-[#00545f]'
                  : 'bg-[#CFEAEC] text-[#ffffffa6] cursor-not-allowed',
              ]"
            >
              Submit
            </button>
          </aside>
        </form>
       </div>
      </Modal>

      <Modal
        v-show="thankYou"
        :isVisible="thankYou"
        @close="closeThankYouModal"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-scroll lg:overflow-hidden bg-black/50"
        
      >
        <div class="bg-white rounded-xl w-[95%] max-w-lg lg:w-full py-4 sm:py-6 lg:py-8 relative mx-auto">
          <div
          class="w-full flex flex-col gap-4 py-4 bg-[#EAECF0] border-b-2 border-b-[#EAECF0] items-center"
        >
          <Icon name="i-tdesign:wry-smile" class="text-[#00545f] text-4xl" />
          <h2 class="font-bold text-2xl font-jost">Thank you for your feedback</h2>
          <p class="text-[#555B64] font-raleway text-sm">
            We have received your feedback! Our team will attend to it.
          </p>
        </div>
        <aside class="flex flex-col bg-white mt-4">
          <button
            class="w-[30%] p-3 rounded-3xl mx-auto font-semibold cursor-pointer hover:bg-[#00545f] hover:text-[#EAECF0] bg-[#EAECF0] text-[#00545f] text-sm"
            @click="closeThankYouModal"
          >
            Close
          </button>
        </aside>
        </div>
      </Modal>
    
  </div>
</template>
