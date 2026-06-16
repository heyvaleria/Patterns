export type AuthUser = {
  id: string
  email: string
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'unauthenticated' }
  | { status: 'error'; message: string }


  // this is a discriminated union
  // Each branch has a different status string. TypeScript uses that to narrow the type:
  // You can never accidentally access state.user when the user isn't
  // logged in. The type system makes it impossible.
