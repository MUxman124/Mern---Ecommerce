import { useState, useEffect } from "react";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useCartStore from "../store/ecomStore";
import axios from "axios";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

export default function CheckoutPage() {
  const {
    cart,
    clearCart,
    removeProductFromCart,
    updateProductQuantityInCart,
    fetchProducts,
  } = useCartStore();

  const [shippingDetails, setShippingDetails] = useState({});
  const products = cart;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleShippingDetails = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const [clientSecret, setClientSecret] = useState("");

  const createPaymentIntent = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/create-payment-intent",
      { amount: 1000 },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setClientSecret(response.data.clientSecret);
    console.log(response.data.clientSecret, "seceret");
  };

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const handlePayment  = () => {
    document.querySelector("#stripe-button").click();
  }

  if (cart.length == 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600">
            Add some items to your cart to checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div
        aria-hidden="true"
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
      />
      <div
        aria-hidden="true"
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-lime-900 lg:block"
      />

      <header className="relative mx-auto max-w-7xl bg-lime-900 py-6 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:bg-transparent lg:px-8 lg:pb-10 lg:pt-6">
        {/* <div className="mx-auto flex max-w-2xl px-4 lg:w-full lg:max-w-lg lg:px-0">
          <a href="#">
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=lime&shade=300"
              className="h-8 w-auto lg:hidden"
            />
            <img
              alt=""
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=lime&shade=600"
              className="hidden h-8 w-auto lg:block"
            />
          </a>
        </div> */}
      </header>

      <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-lime-900 pb-12 pt-6 text-lime-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <dl>
              <dt className="text-sm font-medium">Amount due</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-white">
                $232.00
              </dd>
            </dl>

            <ul
              role="list"
              className="divide-y divide-white/10 text-sm font-medium"
            >
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <img
                    alt={product.imageAlt}
                    src={product.imageUrl}
                    className="size-20 flex-none rounded-md object-cover"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-white">{product.name}</h3>
                    <p>{product.color}</p>
                    <p>{product.size}</p>
                  </div>
                  <p className="flex-none text-base font-medium text-white">
                    ${product.price}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-white/10 pt-6 text-sm font-medium">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>
                  ${" "}
                  {products.reduce(
                    (total, product) => total + product.price,
                    0
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd>$25.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Taxes</dt>
                <dd>$47.60</dd>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-6 text-white">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  ${" "}
                  {products.reduce(
                    (total, product) => total + product.price,
                    0
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Payment and shipping details
          </h2>

          <form>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <div>
                <h3
                  id="contact-info-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Contact information
                </h3>

                <div className="mt-6">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      required
                      onChange={handleShippingDetails}
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-lime-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3
                  id="payment-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Payment details
                </h3>

                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm total={total} cart={cart} shippingDetails={shippingDetails} />
                  </Elements>
                )}
              </div>

              <div className="mt-10">
                <h3
                  id="shipping-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Shipping address
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="address"
                        name="address"
                        type="text"
                        onChange={handleShippingDetails}
                        required
                        autoComplete="street-address"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-lime-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        required
                        onChange={handleShippingDetails}
                        autoComplete="address-level2"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-lime-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        id="region"
                        name="region"
                        type="text"
                        onChange={handleShippingDetails}
                        required
                        autoComplete="address-level1"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-lime-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        id="zipCode"
                        name="zipCode"
                        onChange={handleShippingDetails}
                        type="text"
                        autoComplete="zipCode"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-lime-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Billing information
                </h3>

                <div className="mt-6 flex gap-3">
                  <div className="flex h-5 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        defaultChecked
                        id="same-as-shipping"
                        name="same-as-shipping"
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-lime-600 checked:bg-lime-600 indeterminate:border-lime-600 indeterminate:bg-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:checked]:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label
                    htmlFor="same-as-shipping"
                    className="text-sm font-medium text-gray-900"
                  >
                    Same as shipping information
                  </label>
                </div>
              </div>

              <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  onClick={handlePayment}
                  className="rounded-md border border-transparent bg-lime-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Pay now
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
