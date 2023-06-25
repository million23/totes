import { ActionIcon, Box, Button, Card, Flex, Group, Modal, Paper, SimpleGrid, Space, Text, TextInput, Title } from "@mantine/core"
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { Link, RichTextEditor } from '@mantine/tiptap';

import Highlight from '@tiptap/extension-highlight';
import { NextPage } from "next"
import StarterKit from '@tiptap/starter-kit';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { Tote } from "@/lib/types"
import ToteCard from "@/components/ToteCard"
import Underline from '@tiptap/extension-underline';
import dayjs from "dayjs"
import { useDisclosure } from "@mantine/hooks"
import { useEditor } from '@tiptap/react';
import { useForm } from "@mantine/form"
import { usePersistentData } from "@/lib/stores"

const UUID = () => {
  const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return pattern.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const Home: NextPage = () => {
  const { accountData, setAccountData } = usePersistentData()
  const [addToteModalOpened, addToteModalHandlers] = useDisclosure(false)
  const toteDetails = useForm({
    initialValues: {
      content: '<p><strong>Hey there!</strong></p><p>You can add content here</p>',
      createdAt: new Date(),
      id: '',
      isArchived: false,
      title: '',
      updatedAt: new Date(),
    } as Tote
  })
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: toteDetails.values.content,
    onUpdate: ({ editor }) => {
      // check if editor is empty, if so, add the default placeholder
      if (editor.getHTML() === '<p></p>') {
        editor.commands.setContent('<p><strong>Hey there!</strong></p><p>You can add content here</p>')
      }

      toteDetails.setFieldValue('content', editor.getHTML())
    }
  });

  const handleAddTote = (newTote: Tote) => {
    newTote.id = UUID()

    const totes = [...accountData.totes, newTote]
    setAccountData({ ...accountData, totes })
    toteDetails.reset()
    addToteModalHandlers.close()
  }

  return accountData && (
    <div>
      <Modal opened={addToteModalOpened} onClose={() => {
        addToteModalHandlers.close()
        toteDetails.reset()
      }} title="Add Tote" size="xl">
        <form onSubmit={toteDetails.onSubmit(handleAddTote)}>
          <TextInput required label="Title" placeholder="Tote 1" mb={10} {...toteDetails.getInputProps("title")} />
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
          <Button mt={25} fullWidth leftIcon={<IconPlus />} type="submit">
            Add Tote
          </Button>
        </form>
      </Modal>

      <Box mt={100} mb={50}>
        <Title order={1}>Hello, {accountData.firstName}!</Title>
      </Box>

      <Flex justify="space-between" align="center">
        <Title order={3}>My Totes</Title>
        <Button onClick={() => {
          addToteModalHandlers.open()
          toteDetails.reset()
        }} leftIcon={<IconPlus />}>Add Totes</Button>
      </Flex>

      {accountData.totes.length === 0 && (
        <Card shadow="lg"
          mt={20}>
          <Text align="center">No totes yet. Click on the button above to add one.</Text>
        </Card>
      )}
      <SimpleGrid
        breakpoints={[
          { minWidth: 'sm', cols: 1 },
          { minWidth: 'md', cols: 2 },
          { minWidth: 'lg', cols: 3 },
        ]}
        mt={20}>
        {accountData.totes.map((tote) => <ToteCard tote={tote} key={tote.id} />)}
      </SimpleGrid>
    </div >
  )
}

export default Home