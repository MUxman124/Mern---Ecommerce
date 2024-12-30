import { Fragment, useState } from "react";

import { ProductList } from "../components/ProductList.jsx";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import TrendingProducts from "../views/TrendingProducts.jsx";
const offers = [
  {
    name: "Download the app",
    description: "Get an exclusive $5 off code",
    href: "#",
  },
  {
    name: "Return when you're ready",
    description: "60 days of free returns",
    href: "#",
  },
  {
    name: "Sign up for our newsletter",
    description: "15% off your first order",
    href: "#",
  },
];
const collections = [
  {
    name: "Desk and Office",
    description: "Work from home accessories",
    imageSrc:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt:
      "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
    href: "#",
  },
  {
    name: "Self-Improvement",
    description: "Journals and note-taking",
    imageSrc:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt:
      "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
    href: "#",
  },
  {
    name: "Travel",
    description: "Daily commute essentials",
    imageSrc:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
    href: "#",
  },
];
const testimonials = [
  {
    id: 1,
    quote:
      "My order arrived super quickly. The product is even better than I hoped it would be. Very happy customer over here!",
    attribution: "Sarah Peters, New Orleans",
  },
  {
    id: 2,
    quote:
      "I had to return a purchase that didn’t fit. The whole process was so simple that I ended up ordering two new items!",
    attribution: "Kelly McPherson, Chicago",
  },
  {
    id: 3,
    quote:
      "Now that I’m on holiday for the summer, I’ll probably order a few more shirts. It’s just so convenient, and I know the quality will always be there.",
    attribution: "Chris Paul, Phoenix",
  },
];

export default function Index() {
  return (
    <>
      <NavBar />
      <div className="bg-white">
        {/* Mobile menu */}

        <main>
          {/* Hero */}
          <div className="flex flex-col border-b border-gray-200 lg:border-0">
            <nav aria-label="Offers" className="order-last lg:order-first">
              <div className="mx-auto max-w-7xl lg:px-8">
                <ul
                  role="list"
                  className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0"
                >
                  {offers.map((offer) => (
                    <li key={offer.name} className="flex flex-col">
                      <a
                        href={offer.href}
                        className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10"
                      >
                        <p className="text-sm text-gray-500">{offer.name}</p>
                        <p className="font-semibold text-gray-900">
                          {offer.description}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute hidden h-full w-1/2 bg-gray-100 lg:block"
              />
              <div className="relative bg-gray-100 lg:bg-transparent">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
                  <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
                    <div className="lg:pr-16">
                      <h1 className="text-4xl font-bold tracking-tight text-lime-600 sm:text-5xl xl:text-6xl">
                        Focus on what matters
                      </h1>
                      <p className="mt-4 text-xl text-gray-600">
                        All the charts, datepickers, and notifications in the
                        world can't beat checking off some items on a paper
                        card.
                      </p>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="inline-block border border-transparent bg-lime-500 shadow-lg shadow-lime-400 px-8 py-3 font-medium text-white hover:bg-lime-600"
                        >
                          Shop All
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-48 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Trending products */}
          <TrendingProducts />
          <section aria-labelledby="trending-heading" className="bg-white">
            <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
              <div className="relative mt-8">
                <div className="relative w-full overflow-x-auto">
                  <ProductList />
                </div>
                <div className="flex items-center justify-center mt-4">
                  <button className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded-full hover-transform hover:transform hover:scale-105 transition duration-300">
                    Shop All
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Collections */}
          <section
            aria-labelledby="collections-heading"
            className="bg-gray-100"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
                <h2
                  id="collections-heading"
                  className="text-2xl font-bold text-gray-900"
                >
                  Collections
                </h2>

                <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                  {collections.map((collection) => (
                    <div key={collection.name} className="group relative">
                      <img
                        alt={collection.imageAlt}
                        src={collection.imageSrc}
                        className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-[2/1] lg:aspect-square"
                      />
                      <h3 className="mt-6 text-sm text-gray-500">
                        <a href={collection.href}>
                          <span className="absolute inset-0" />
                          {collection.name}
                        </a>
                      </h3>
                      <p className="text-base font-semibold text-gray-900">
                        {collection.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sale and testimonials */}
          <div className="relative overflow-hidden">
            {/* Decorative background image and gradient */}
            <div aria-hidden="true" className="absolute inset-0">
              <div className="absolute inset-0 mx-auto max-w-7xl overflow-hidden xl:px-8">
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/ecommerce-images/home-page-02-sale-full-width.jpg"
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-white/75" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white" />
            </div>

            {/* Sale */}
            <section
              aria-labelledby="sale-heading"
              className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-32 text-center sm:px-6 lg:px-8"
            >
              <div className="mx-auto max-w-2xl lg:max-w-none">
                <h2
                  id="sale-heading"
                  className="text-4xl font-bold tracking-tight text-lime-600 sm:text-5xl lg:text-6xl"
                >
                  Get 25% off during our one-time sale
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-xl text-gray-600">
                  Most of our products are limited releases that won't come
                  back. Get your favorite items while they're in stock.
                </p>
                <a
                  href="#"
                  className="mt-6 inline-block w-full rounded-md border border-transparent bg-gray-900 px-8 py-3 font-medium text-white hover:bg-gray-800 sm:w-auto"
                >
                  Get access to our one-time sale
                </a>
              </div>
            </section>

            {/* Testimonials */}
            <section
              aria-labelledby="testimonial-heading"
              className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
            >
              <div className="mx-auto max-w-2xl lg:max-w-none">
                <h2
                  id="testimonial-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  What are people saying?
                </h2>

                <div className="mt-16 space-y-16 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
                  {testimonials.map((testimonial) => (
                    <blockquote
                      key={testimonial.id}
                      className="sm:flex lg:block"
                    >
                      <svg
                        width={24}
                        height={18}
                        viewBox="0 0 24 18"
                        aria-hidden="true"
                        className="shrink-0 text-gray-300"
                      >
                        <path
                          d="M0 18h8.7v-5.555c-.024-3.906 1.113-6.841 2.892-9.68L6.452 0C3.188 2.644-.026 7.86 0 12.469V18zm12.408 0h8.7v-5.555C21.083 8.539 22.22 5.604 24 2.765L18.859 0c-3.263 2.644-6.476 7.86-6.451 12.469V18z"
                          fill="currentColor"
                        />
                      </svg>
                      <div className="mt-8 sm:ml-6 sm:mt-0 lg:ml-0 lg:mt-10">
                        <p className="text-lg text-gray-600">
                          {testimonial.quote}
                        </p>
                        <cite className="mt-4 block font-semibold not-italic text-gray-900">
                          {testimonial.attribution}
                        </cite>
                      </div>
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
