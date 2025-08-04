import { Store } from '@tanstack/react-store'

type UserState = {
  accessToken: string
}

export const userStore: Store<UserState> = new Store({
  accessToken: '',
})
