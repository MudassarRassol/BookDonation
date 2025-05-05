import React from 'react'
import  SendCode from '@/components/ResetPassword/SendCode'
import CheckCode from  '@/components/ResetPassword/CheckCode'
import UpdatePassword from '@/components/ResetPassword/UpdatePassword'
const page = () => {
  return (
    <div className=' h-[80vh] md:h-[90vh] overflow-hidden' >
       <div className='h-[80vh] md:h-[90vh]  flex flex-col items-center justify-center ' >
       <SendCode/>
       </div>
       <div className='h-[80vh] md:h-[90vh]  flex flex-col items-center justify-center ' >
       <CheckCode/>
       </div>
       <div className='h-[80vh] md:h-[90vh]  flex flex-col items-center justify-center ' >
       <UpdatePassword/>
       </div>
    </div>
  )
}

export default page