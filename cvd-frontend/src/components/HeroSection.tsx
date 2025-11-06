"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className='relative w-full overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-green-950 dark:to-green-900'>
      {/* Background decorative elements */}
      <div className='absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl dark:bg-green-900 dark:opacity-10'></div>
      <div className='absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl dark:bg-teal-900 dark:opacity-10'></div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left content */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full'>
                <Heart className='w-4 h-4 text-green-600 dark:text-green-400 mr-2' />
                <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                  Healthcare AI
                </span>
              </div>

              <h1 className='text-5xl md:text-6xl font-bold text-green-900 dark:text-white leading-tight'>
                Predict Your{" "}
                <span className='bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent'>
                  Heart Health
                </span>{" "}
                Today
              </h1>

              <p className='text-xl text-slate-600 dark:text-slate-300 leading-relaxed'>
                Advanced CVD risk prediction powered by machine learning. Get
                personalized insights into your cardiovascular health in seconds
                with our intelligent assessment system.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <a href='#assessment'>
                <Button
                  size='lg'
                  className='bg-green-600 hover:bg-green-700 text-white'
                >
                  Start Assessment
                  <ArrowRight className='ml-2 w-4 h-4' />
                </Button>
              </a>
              <Link to={"/signup"}>
                <Button
                  size='lg'
                  variant='outline'
                  className='border border-gray-100  bg-transparent'
                >
                  Register
                </Button>
              </Link>
            </div>

            {/* Stats */}
            {/* <div className='grid grid-cols-3 gap-4 pt-8'>
              <div>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  97%
                </p>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Accuracy Rate
                </p>
              </div>
              <div>
                <p className='text-2xl font-bold text-teal-600 dark:text-teal-400'>
                  10K+
                </p>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Assessments
                </p>
              </div>
              <div>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  50ms
                </p>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Results Time
                </p>
              </div>
            </div> */}
          </div>

          {/* Right image */}
          <div className='relative'>
            <div className='relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-green-800'>
              <img
                // src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/medical-health-dashboard-with-heart-rate-chart-and-ieUG9OiYqIsQKqarbB6L43sDB32ktl.jpg'
                src='https://i.pinimg.com/1200x/57/8d/a1/578da16150f02092d6eab8aa86d3fa94.jpg'
                alt='CVD Risk Assessment Dashboard'
                className='w-full h-auto'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
