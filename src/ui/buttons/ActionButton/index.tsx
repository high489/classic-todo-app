import styles from './action-button.module.scss'
import { FC, ReactNode } from 'react'

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: FC<ActionButtonProps> = ({
  children, onClick, disabled = false
}) => {

  return (
    <>
      <button 
        className={styles['action-button']}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  )
}

export { ActionButton }