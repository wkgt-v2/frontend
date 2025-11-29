<template>
  <ClientOnly>
    <div v-if="editor" class="space-y-2 w-full">
      <div class="overflow-x-auto">
        <div class="flex items-center gap-2">
          <UTooltip text="Undo">
            <UButton
              icon="i-material-symbols:undo"
              variant="soft"
              :disabled="!editor.can().chain().focus().undo().run()"
              :active="true"
              @click="editor.chain().focus().undo().run()"
            />
          </UTooltip>
          <UTooltip text="Redo">
            <UButton
              icon="i-material-symbols:redo"
              variant="soft"
              :disabled="!editor.can().chain().focus().redo().run()"
              @click="editor.chain().focus().redo().run()"
            />
          </UTooltip>
          <UDropdownMenu :items="headingItems">
            <UButton
              icon="i-material-symbols:format-size"
              :variant="editor.isActive('heading') ? 'solid' : 'soft'"
              trailing-icon="i-material-symbols:keyboard-arrow-down"
            />
          </UDropdownMenu>
          <UTooltip text="Bold">
            <UButton
              icon="i-material-symbols:format-bold"
              :variant="editor.isActive('bold') ? 'solid' : 'soft'"
              :disabled="!editor.can().chain().focus().toggleBold().run()"
              @click="editor.chain().focus().toggleBold().run()"
            />
          </UTooltip>
          <UTooltip text="Italic">
            <UButton
              icon="i-material-symbols:format-italic"
              :variant="editor.isActive('italic') ? 'solid' : 'soft'"
              :disabled="!editor.can().chain().focus().toggleItalic().run()"
              @click="editor.chain().focus().toggleItalic().run()"
            />
          </UTooltip>
          <UTooltip text="Strike">
            <UButton
              icon="i-material-symbols:strikethrough-s"
              :variant="editor.isActive('strike') ? 'solid' : 'soft'"
              :disabled="!editor.can().chain().focus().toggleStrike().run()"
              @click="editor.chain().focus().toggleStrike().run()"
            />
          </UTooltip>
          <UTooltip text="Underline">
            <UButton
              icon="i-material-symbols:format-underlined"
              :variant="editor.isActive('underline') ? 'solid' : 'soft'"
              :disabled="!editor.can().chain().focus().toggleUnderline().run()"
              @click="editor.chain().focus().toggleUnderline().run()"
            />
          </UTooltip>
          <UTooltip text="Paragraph">
            <UButton
              icon="i-material-symbols:notes"
              :variant="editor.isActive('paragraph') ? 'solid' : 'soft'"
              @click="editor.chain().focus().setParagraph().run()"
            />
          </UTooltip>
          <UTooltip text="Code">
            <UButton
              icon="i-material-symbols:code"
              :variant="editor.isActive('code') ? 'solid' : 'soft'"
              :disabled="!editor.can().chain().focus().toggleCode().run()"
              @click="editor.chain().focus().toggleCode().run()"
            />
          </UTooltip>
          <UTooltip text="Code block">
            <UButton
              icon="i-material-symbols:code-blocks-outline"
              :variant="editor.isActive('codeBlock') ? 'solid' : 'soft'"
              @click="editor.chain().focus().toggleCodeBlock().run()"
            />
          </UTooltip>
          <UTooltip text="Blockquote">
            <UButton
              icon="i-material-symbols:format-quote"
              :variant="editor.isActive('blockquote') ? 'solid' : 'soft'"
              @click="editor.chain().focus().toggleBlockquote().run()"
            />
          </UTooltip>
          <UTooltip text="Bullet list">
            <UButton
              icon="i-material-symbols:format-list-bulleted"
              :variant="editor.isActive('bulletList') ? 'solid' : 'soft'"
              @click="editor.chain().focus().toggleBulletList().run()"
            />
          </UTooltip>
          <UTooltip text="Ordered list">
            <UButton
              icon="i-material-symbols:format-list-numbered"
              :variant="editor.isActive('orderedList') ? 'solid' : 'soft'"
              @click="editor.chain().focus().toggleOrderedList().run()"
            />
          </UTooltip>
          <UTooltip text="Increase list indent">
            <UButton
              icon="i-material-symbols:format-indent-increase"
              variant="soft"
              :disabled="!editor.can().sinkListItem('listItem')"
              @click="editor.chain().focus().sinkListItem('listItem').run()"
            />
          </UTooltip>
          <UTooltip text="Decrease list indent">
            <UButton
              icon="i-material-symbols:format-indent-decrease"
              variant="soft"
              :disabled="!editor.can().liftListItem('listItem')"
              @click="editor.chain().focus().liftListItem('listItem').run()"
            />
          </UTooltip>
          <UTooltip text="Horizontal Rule">
            <UButton
              icon="i-material-symbols:horizontal-rule"
              variant="soft"
              @click="editor.chain().focus().setHorizontalRule().run()"
            />
          </UTooltip>
          <UTooltip text="Hard Break">
            <UButton
              icon="i-material-symbols:keyboard-return"
              variant="soft"
              @click="editor.chain().focus().setHardBreak().run()"
            />
          </UTooltip>
          <UTooltip v-if="isFeatureEnabled('image')" text="Insert Image">
            <UButton
              as="label"
              icon="i-material-symbols:image-outline"
              variant="soft"
            >
              <input
                type="file"
                id="input_image"
                :accept="imageAccept.map((e) => `.${e}`).join(',')"
                @change="fileSelected($event, 'image')"
                class="hidden"
              />
            </UButton>
          </UTooltip>
          <UTooltip v-if="isFeatureEnabled('video')" text="Insert Video">
            <UButton
              as="label"
              icon="i-material-symbols:play-circle-outline"
              variant="soft"
            >
              <input
                type="file"
                id="input_image"
                :accept="videoAccept.map((e) => `.${e}`).join(',')"
                @change="fileSelected($event, 'video')"
                class="hidden"
              />
            </UButton>
          </UTooltip>
        </div>
      </div>
      <div
        class="w-full rounded-md transition-colors p-4 text-base text-highlighted bg-default ring ring-inset inset-y-2"
        :class="{
          'ring-accented': !isError,
          'ring-error': isError,
        }"
        @click="editor.commands.focus()"
      >
        <EditorContent :editor="editor" :class="editorClasses" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ClientOnly } from "#components";
import type { DropdownMenuItem } from "@nuxt/ui";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import Image from "@tiptap/extension-image";
import type { HttpSuccess } from "~/types/http";

interface UploadResponse {
  url: string;
  mime_type: string;
  size: number;
  key: string;
}

const props = withDefaults(
  defineProps<{
    editorClasses?: string;
    isError?: boolean;
    placeholder?: string;
    enableFeature?: string[];
  }>(),
  {
    editorClasses: "min-h-32",
  }
);

const { bearer } = useToken();
const editor = ref<Editor>();
const emit = defineEmits(["input"]);
const imageAccept = ["png", "jpg", "jpeg", "gif", "webp"];
const maxSizeImage = 50;
const maxSizeVideo = 50;
const model = defineModel<string>({ default: "" });
const toast = useToast();
const videoAccept = ["mp4", "mkv", "mov"];

const headingItems = computed<DropdownMenuItem[][]>(() => {
  return [
    [
      {
        label: "Heading 1",
        active: editor.value?.isActive("heading", { level: 1 }),
        onSelect: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        label: "Heading 2",
        active: editor.value?.isActive("heading", { level: 2 }),
        onSelect: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "Heading 3",
        active: editor.value?.isActive("heading", { level: 3 }),
        onSelect: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        label: "Heading 4",
        active: editor.value?.isActive("heading", { level: 4 }),
        onSelect: () => editor.value?.chain().focus().toggleHeading({ level: 4 }).run(),
      },
      {
        label: "Heading 5",
        active: editor.value?.isActive("heading", { level: 5 }),
        onSelect: () => editor.value?.chain().focus().toggleHeading({ level: 5 }).run(),
      },
      {
        label: "Heading 6",
        active: editor.value?.isActive("heading", { level: 6 }),
        onSelect: () => editor.value?.chain().focus().toggleHeading({ level: 6 }).run(),
      },
    ],
  ];
});

watch(model, (val) => {
  if (editor.value?.getHTML() === val) return;
  editor.value?.commands.setContent(val, { emitUpdate: false });
});

async function fileSelected(event: Event, type: "image" | "video") {
  const body = document.querySelector("body");
  const input = event.target as HTMLInputElement;
  try {
    if (!input.files?.length) return;
    const file = input.files[0];
    if (!file) return;

    const acceptedExtension = type === "image" ? imageAccept : videoAccept;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!fileExtension || !acceptedExtension.includes(fileExtension)) {
      toast.add({
        title: "failed",
        description: `Invalid file type. Please select a${type === "image" ? "n" : ""} ${type} file.`,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
        duration: 0,
      });
      input.value = "";
      return;
    }

    const maxSize = type === "image" ? maxSizeImage : maxSizeVideo;
    const fileType = type === "image" ? "Image" : "Video";

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      toast.add({
        title: "failed",
        description: `${fileType} should be less than ${maxSize}MB`,
        color: "error",
        icon: "i-heroicons-exclamation-circle",
        duration: 0,
      });
      return;
    }

    body?.classList.add("cursor-progress");

    const formData = new FormData();
    formData.append("content_file", file);
    const res = await $fetch<HttpSuccess<UploadResponse>>(`${useRuntimeConfig().public.apiBase}/blog-articles/upload-media`, {
      headers: { ...bearer },
      method: "POST",
      body: formData,
    });

    const url = res.data.url;

    if (type === "image") {
      editor.value?.chain().focus().setImage({ src: url }).run();
    } else {
      editor.value?.chain().focus().setVideo(url).run();
    }
  } catch (err: any) {
    toast.add({
      title: "failed",
      description: err?.data?.message || "Failed upload file",
      color: "error",
      icon: "i-heroicons-exclamation-circle",
      duration: 0,
    });
  }
  body?.classList.remove("cursor-progress");
  input.value = "";
}

function isFeatureEnabled(key: string) {
  return props.enableFeature?.includes(key);
}

onMounted(() => {
  editor.value = new Editor({
    content: model.value,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
      }),
      Placeholder.configure({
        placeholder: props.placeholder || "",
      }),
      TiptapVideo,
    ],
    onUpdate: () => {
      if (!editor.value) return;
      model.value = editor.value.getHTML();
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
