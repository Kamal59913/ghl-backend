"use client"
import React from 'react'
import AuthWrapper from '@/components/AuthWrapper/AuthWrapper'

export default function page() {
  return (
    <AuthWrapper>
    <div className="mx-auto max-w-7xl px-2 md:px-0">
  <div className="my-4">
    <h1 className="text-3xl font-bold">Users</h1>
    <p className="mt-2 text-gray-500">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
      voluptatum.
    </p>
  </div>
  <div className="grid grid-cols-1 gap-[30px] md:grid-cols-3">
    <div className="flex flex-col items-center text-start">
      <div
        className="relative flex h-[342px] w-full flex-col justify-end rounded-[10px] bg-red-300"
        // style="background-position:center;background-size:cover;background-repeat:no-repeat"
      >
        <img
          src="image.png"
          alt=""
          className="z-0 h-full w-full rounded-[10px] object-cover border"
        />
        <div className="absolute bottom-4 left-4">
          <h1 className="text-xl font-semibold text-grey">John Doe</h1>
          <h6 className="text-base text-grey">Frontend Developer</h6>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center text-start">
      <div
        className="relative flex h-[342px] w-full flex-col justify-end rounded-[10px] bg-red-300"
        // style="background-position:center;background-size:cover;background-repeat:no-repeat"
      >
        <img
          src="image.png"
          alt=""
          className="z-0 h-full w-full rounded-[10px] object-cover border"
        />
        <div className="absolute bottom-4 left-4">
          <h1 className="text-xl font-semibold text-grey">Mark Cook</h1>
          <h6 className="text-base text-grey">Backend Developer</h6>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center text-start">
      <div
        className="relative flex h-[342px] w-full flex-col justify-end rounded-[10px] bg-red-300"
        // style="background-position:center;background-size:cover;background-repeat:no-repeat"
      >
        <img
          src="image.png"
          alt=""
          className="z-0 h-full w-full rounded-[10px] object-cover border"
        />
        <div className="absolute bottom-4 left-4">
          <h1 className="text-xl font-semibold text-grey">Ketty</h1>
          <h6 className="text-base text-grey">Designer</h6>
        </div>
      </div>
    </div>
  </div>
</div>
</AuthWrapper>
)
}
