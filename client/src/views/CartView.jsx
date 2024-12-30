import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import useCartStore from "../store/ecomStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CartView() {
  const {
    cart,
    clearCart,
    removeProductFromCart,
    updateProductQuantityInCart,
    fetchProducts,
  } = useCartStore();
  const products = cart;
  const [quantity, setQuantity] = useState(1);

  const updateQuantity = async (productId, quantity) => {
    console.log(productId, quantity);
    updateProductQuantityInCart(productId, quantity);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {products.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="shrink-0">
                    <img
                      alt={product?.imageAlt}
                      src={product.imageUrl}
                      className="size-24 rounded-md object-cover sm:size-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a
                              href={product?.href}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product?.name}
                            </a>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-gray-500">{product?.color}</p>
                          {product?.size ? (
                            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                              {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${product.price * product.quantity}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            onClick={() => removeProductFromCart(product._id)}
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon aria-hidden="true" className="size-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor={`quantity-${product._id}`}
                        className="text-lg font-medium text-gray-700"
                      >
                        Quantity:
                      </label>
                      <div className="flex items-center border border-gray-100 overflow-hidden">
                        <button
                          type="button"
                          className="px-3 py-2 hover:bg-gray-100 text-lime-500 font-bold"
                          onClick={() =>
                            updateQuantity(product._id, product.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          id={`quantity-${product._id}`}
                          type="number"
                          min="1"
                          max={product.stock}
                          value={product.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              product._id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="px-1 py-2 text-center"
                        />
                        <button
                          type="button"
                          className="px-3 py-2 hover:bg-gray-100 text-lime-500 font-bold"
                          onClick={() =>
                            updateQuantity(product._id, product.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                      {product?.inStock ? (
                        <CheckIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-green-500"
                        />
                      ) : (
                        <ClockIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-gray-300"
                        />
                      )}

                      <span>
                        {product?.inStock
                          ? "In stock"
                          : `Ships in ${product.leadTime}`}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  $
                  {products
                    .reduce((total, product) => total + product.price * product.quantity, 0)
                    .toFixed(2)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="size-5"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$8.32</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  $
                  {(products.reduce(
                    (total, product) => total + (product.price * product.quantity),
                    0
                  ) + 13.32).toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <Link to="/checkout">
              <button
                type="submit"
                className="w-full border border-transparent bg-lime-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
              </  Link>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
