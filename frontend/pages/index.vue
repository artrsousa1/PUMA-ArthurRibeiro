<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Github from '@/assets/icons/github-svgrepo-com.svg'
import { Star, Trash2, ExternalLink } from 'lucide-vue-next'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import axios from 'axios'
import {
  Card,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

import {
  Avatar,
  AvatarImage,
} from '@/components/ui/avatar'

import { ref } from 'vue'

interface User {
  username: string,
  pictureUrl: string,
  profileUrl: string,
  isFavorited: boolean,
  name?: string,
}
import { onBeforeMount } from 'vue';

const { toast } = useToast();
onBeforeMount(() => {
  getUsers();
});

const username = ref('');
const users = ref<User[]>([]);

const addUser = async () => {
  if(!username.value) {
    toast({
      title: 'Erro',
      description: 'Digite um username',
      variant: 'destructive',
      duration: 1000,
    });
    return;
  }
  const response = await fetch(`http://localhost:8000/api/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username.value }),
  });
  const data = await response.json();
  if(response.status === 201) {
    toast({
      title: 'Sucesso',
      description: data.message,
      duration: 1000,
    });
  } else {
    toast({
      title: 'Erro',
      description: data.error,
      variant: 'destructive',
      duration: 1000,
    });
  }
  await getUsers();
  username.value = '';
}


const getUsers = async () => {
  console.log('getUsers');
  const response = await fetch('http://localhost:8000/api/users');
  const data = await response.json();
  users.value = data.data;
}

const deleteUser = async (username: string) => {
  const response = await fetch(`http://localhost:8000/api/users/${username}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if(response.status === 200) {
    toast({
      title: 'Sucesso',
      description: data.message,
      duration: 1000,
    });
  } else {
    toast({
      title: 'Erro',
      description: data.error,
      variant: 'destructive',
      duration: 1000,
    });
  }
  await getUsers();
}

const starUser = async (username: string) => {
  const response = await fetch(`http://localhost:8000/api/users/${username}/toggle-star`, {
    method: 'PATCH',
  });
  const data = await response.json();
  if(response.status === 200) {
    toast({
      title: 'Sucesso',
      description: data.message,
      duration: 1000,
    });
  } else {
    toast({
      title: 'Erro',
      description: data.error,
      variant: 'destructive',
      duration: 1000,
    });
  }
  await getUsers();
}

const sortUsers = async () => {
  users.value = users.value.sort((a, b) => {
    if((a.name || a.username) < (b.name || b.username)) {
      return -1;
    }
    if((a.name || a.username) > (b.name || b.username)) {
      return 1;
    }
    return 0;
  });
}

const redirectToProfile = async (profileUrl: string) => {
  window.open(profileUrl, "_blank");
}

</script>

<template>
  <Toaster />
  <div class="flex min-h-screen w-full flex-col">
    <header class="sticky top-0 flex h-24 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div class="flex items-center justify-center gap-10 ml-4">
        <Github class="text-[50px]" />
        <span class="text-lg font-medium text-primary md:text-2xl">GitHub Favorite Users</span>
      </div>
      <div class="ml-auto">
        <Button @click="sortUsers">
          Ordenar por ordem alfabética
        </Button>
      </div>
    </header>
    <main class="flex-1 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center w-full h-full">
          <div class="top-24 w-full max-w-sm space-x-4 my-4" >
            <Card class="p-4">
              <Label class="mb-2 block">
                Adicionar usuário aos favoritos
              </Label>
              <div class="flex space-x-2">
                <Input v-model="username" placeholder="Digite o username" class="w-72" />
                <Button @click="addUser">Adicionar</Button>
              </div>
            </Card>
          </div>
          <p v-if="users.length === 0" class="text-lg font-medium mx-auto text-center">Nenhum usuário favoritado</p>
          <div v-else class="flex flex-col items-center justify-center mt-20 md:grid sm:grid-cols-1 md:grid-cols-2 md:gap-4 w-full max-w-4xl"> 
            <div v-for="user in users" :key="user.username" class="w-full mx-auto max-w-[80%] mb-4">
              <Card>
                <CardHeader class="flex flex-col items-center gap-4">
                  <Avatar class="h-24 w-24">
                    <AvatarImage :src="user.pictureUrl" />
                  </Avatar>
                  <div class="flex flex-col items-center text-center">
                    <h2 class="text-2xl font-bold">{{ user.name ? user.name : user.username }}</h2>
                    <p class="text-sm text-muted-foreground">@{{ user.username }}</p>
                  </div>
                </CardHeader>
                <CardFooter class="flex justify-center gap-2">
                    <Button size="icon" :variant="user.isFavorited ? 'starred' : 'outline'" @click="starUser(user.username)">
                    <Star class="w-6 h-6" :fill="user.isFavorited ? 'white' : 'none'" :class="user.isFavorited ? 'text-white' : ''"/>
                    </Button>
                  <Button size="icon" variant="destructive" @click="deleteUser(user.username)">
                    <Trash2 class="w-6 h-6" />
                  </Button>
                    <Button variant="outline" @click="redirectToProfile(user.profileUrl)">
                    Visitar perfil
                    <ExternalLink class="w-6 h-6" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
    </main>
  </div>
</template>
