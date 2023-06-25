import { Box, Button, Center, Container, MantineProvider, Modal, TextInput } from '@mantine/core';
import { __AccountData, usePersistentData } from '@/lib/stores';
import { useDisclosure, useLocalStorage } from '@mantine/hooks'

import { AppProps } from 'next/app';
import Head from 'next/head';
import { User } from '@/lib/types';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { accountData, setAccountData } = usePersistentData()
  const [signUpOpened, { open: openModal, close: closeModal }] = useDisclosure(true)
  const registrationForm = useForm({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      totes: []
    } as User,
    validate: {
      email: (value) => (
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address'
      ),
      firstName: (value) => (
        /^[A-Z]/.test(value) ? null : 'First letter must be capitalized'
      ),
      lastName: (value) => (
        /^[A-Z]/.test(value) ? null : 'First letter must be capitalized'
      )
    }
  })

  const handleRegistration = (data: User) => {
    setAccountData(data)
  }

  useEffect(() => {
    if (accountData) {
      closeModal()
    }
  }, [accountData])

  return (
    <>
      <Head>
        <title>Totes</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
        }}
      >
        <Modal opened={signUpOpened} onClose={closeModal} closeOnClickOutside={false} withCloseButton={false} closeOnEscape={false} centered title="Sign Up">
          <form onSubmit={registrationForm.onSubmit(handleRegistration)}>
            <TextInput
              label="First Name"
              placeholder="John"
              required
              {...registrationForm.getInputProps('firstName')}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              required
              {...registrationForm.getInputProps('lastName')}
            />
            <TextInput
              label="Email"
              placeholder="johndoe@mail.com"
              required
              {...registrationForm.getInputProps('email')}
            />
            <Button
              fullWidth
              mt="xl"
              type='submit'
            >
              Register
            </Button>
          </form>
        </Modal>

        <Container maw={1280}>
          {accountData !== undefined ? (
            <Box py="xl">
              <Component {...pageProps} />
            </Box>
          ) : (
            <Center mih={"100dvh"} >
              <Button onClick={openModal}>Sign Up</Button>
            </Center>
          )}
        </Container>
      </MantineProvider>
    </>
  );
}