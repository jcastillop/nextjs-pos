import React, { ReactNode } from 'react'

type Props = {
    children?: ReactNode;
    title: string
}

const Utab: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>
}

export default Utab