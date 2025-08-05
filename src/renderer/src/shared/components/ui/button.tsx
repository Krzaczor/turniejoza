import { ComponentProps } from 'react'

export interface ButtonProps extends ComponentProps<'button'> {}

export const Button = (props: ButtonProps) => {
  return <button {...props} />
}
