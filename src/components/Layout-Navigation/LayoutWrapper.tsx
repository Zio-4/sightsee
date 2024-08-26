import * as React from 'react';
// import type { ReactNode } from 'react'

type Props = {
  children?: React.ReactNode
};

const LayoutWrapper = ({ children }: Props) => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-10/12 lg:w-8/12">
        {children}
      </div>
    </div>
  )
}

export default LayoutWrapper
