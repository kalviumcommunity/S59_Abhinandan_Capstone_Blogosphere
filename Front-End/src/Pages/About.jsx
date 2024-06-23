import React from 'react';
import { Button, Checkbox, Label, TextInput, Blockquote,  Alert  } from 'flowbite-react';
function About() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Blockquote className="my-4 border-l-4 border-gray-300 bg-gray-100 p-4 dark:border-gray-500 dark:bg-gray-800 mb-10 max-w-[50vw]">
        "At Blogosphere, we believe in the power of ideas to inspire change. Join us on a journey of discovery, empowerment, and innovation as we explore the world together with words!"
      </Blockquote>

      <form className="flex flex-col gap-6 w-full max-w-md p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
        <div>
          <Label htmlFor="email1" value="Your email" className="text-lg font-semibold text-gray-700" />
          <TextInput id="email1" type="email" placeholder="name@blogosphere.com" required className="p-2 border-none focus:ring-2 focus:ring-blue-500 rounded-md w-full" />
        </div>

        <div>
          <Label htmlFor="password1" value="Your password" className="text-lg font-semibold text-gray-700" />
          <TextInput id="password1" type="password" required className="p-2 border-none focus:ring-2 focus:ring-blue-500 rounded-md w-full" />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" className="rounded" />
          <Label htmlFor="remember" className="text-gray-600">Remember me</Label>
        </div>

        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default About;
