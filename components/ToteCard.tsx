import { ActionIcon, Button, Card, Divider, Flex, Menu, Modal, Paper, Text, TextInput, Title } from "@mantine/core"
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react"

import { FC } from "react"
import Highlight from '@tiptap/extension-highlight';
import { RichTextEditor } from "@mantine/tiptap";
import StarterKit from '@tiptap/starter-kit';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { Tote } from "@/lib/types"
import Underline from '@tiptap/extension-underline';
import dayjs from "dayjs";
import parse from 'html-react-parser'
import { useDisclosure } from "@mantine/hooks"
import { useEditor } from '@tiptap/react'
import { useForm } from "@mantine/form";
import { usePersistentData } from "@/lib/stores";

const ToteCard: FC<{
  tote: Tote | null
}> = ({ tote }) => {
  const { accountData, setAccountData } = usePersistentData()
  const [viewModalOpened, viewModalHandlers] = useDisclosure(false)
  const [editModalOpened, editModalHandlers] = useDisclosure(false)
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false)
  const toteEditDetails = useForm({
    initialValues: {
      content: tote?.content || '<p><strong>Hey there!</strong></p><p>You can add content here</p>',
      createdAt: tote?.createdAt || dayjs(),
      id: tote?.id || '',
      isArchived: tote?.isArchived || false,
      title: tote?.title || '',
      updatedAt: tote?.updatedAt || dayjs(),
    } as Tote,
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      TextAlign,
      Superscript,
      SubScript,
    ],
    content: tote?.content || toteEditDetails.values.content,
    onUpdate: ({ editor }) => {
      toteEditDetails.setFieldValue('content', editor.getHTML())
      console.log(toteEditDetails.values)
    }
  });

  return (
    <>
      {/* view tote modal */}
      <Modal opened={viewModalOpened} onClose={viewModalHandlers.close} title="View Tote" size="xl">
        <Paper>
          <Title order={2}>{tote?.title}</Title>
          <Divider my={10} />
          <Text mt={10}>
            {tote?.content ? parse(tote?.content) : parse('<p><strong>Hey there!</strong></p><p>You can add content here</p>')}
          </Text>
        </Paper>
      </Modal>

      {/* edit tote modal */}
      <Modal opened={editModalOpened} onClose={editModalHandlers.close} title="Edit Tote" size="xl">
        <form onSubmit={toteEditDetails.onSubmit(val => {
          const targetID = tote?.id
          const newTotes = accountData.totes.map(tote => {
            if (tote.id === targetID) {
              return {
                ...tote,
                ...val
              }
            } else {
              return tote
            }
          })
          setAccountData({
            ...accountData,
            totes: newTotes
          })
          editModalHandlers.close()
        })}>
          <TextInput label="Name" mb={20} {...toteEditDetails.getInputProps('title')} />
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
          <Button type="submit" fullWidth mt={20}>Save</Button>
        </form>
      </Modal>

      {/* delete tote modal */}
      <Modal opened={deleteModalOpened} onClose={deleteModalHandlers.close} centered title="Delete Tote" size="sm">
        <Text>Are you sure you want to delete this tote entitled &apos;{tote?.title || "sample title"}&apos;</Text>
        <Flex mt={25} gap="sm" justify="end">
          <Button onClick={deleteModalHandlers.close} variant="outline" color="gray">Cancel</Button>
          <Button onClick={() => {
            const targetID = tote?.id
            const newTotes = accountData.totes.filter(tote => tote.id !== targetID)
            setAccountData({
              ...accountData,
              totes: newTotes
            })


          }} variant="outline" color="red">Delete</Button>
        </Flex>
      </Modal>

      {/* tote card */}
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Title order={2}>{tote?.title}</Title>
        <Text lineClamp={3}>
          {tote?.content ? parse(tote?.content) : parse('<p>NOTHING TO SEE HERE</p>')}
        </Text>
        <Flex justify="end">
          <Menu width={200} shadow="md">
            <Menu.Target>
              <ActionIcon mt={25}>
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconEye size={17} />} onClick={() => viewModalHandlers.open()}>View</Menu.Item>
              <Menu.Item icon={<IconEdit size={17} />} onClick={() => editModalHandlers.open()}>Edit</Menu.Item>
              <Menu.Divider />
              <Menu.Item icon={<IconTrash size={17} />} color="red" onClick={() => deleteModalHandlers.open()}>Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        {/* // <Flex mt={25} gap="sm" justify="end">
        //   <ActionIcon onClick={() => editModalHandlers.open()} variant="outline" color="blue" size="lg"><IconEdit /></ActionIcon>
        //   <ActionIcon onClick={() => deleteModalHandlers.open()} variant="outline" color="red" size="lg"><IconTrash /></ActionIcon>
        // </Flex> */}
      </Paper>
    </>

  )
}

export default ToteCard