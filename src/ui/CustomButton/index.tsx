import styles from './custom-button.module.scss'
import { FC, ReactNode } from 'react'

interface CustomButtonProps {
  children: ReactNode
  onClick: () => void
}

const CustomButton: FC<CustomButtonProps> = ({
  children, onClick
}) => {
  return (
    <>
      <button 
        className={styles['custom-button']}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  )
}

export { CustomButton }