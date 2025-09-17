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

const props = withDefaults(
  defineProps<{
    editorClasses?: string;
    isError?: boolean;
    placeholder?: string;
  }>(),
  {
    editorClasses: "min-h-32",
  }
);

const editor = ref<Editor>();
const emit = defineEmits(["input"]);
const model = defineModel<string>({ default: "" });

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

onMounted(() => {
  editor.value = new Editor({
    content: model.value,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: props.placeholder || "",
      }),
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
