"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { translations, Locale } from "@/lib/translations";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";


type OrderStatus = "new" | "processing" | "shipped" | "cancelled";
type PaymentStatus = "paid" | "unpaid";

type OrderItem = {
  product_name: string;
  quantity: number;
  price: string | number;
  total_price: string | number;
};

type Order = {
  items: any;
  order_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  created_at: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
};

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "shipped":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
};

export default function AdminOrdersTable({ locale = "en" }: { locale?: Locale }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const t = translations[locale].common;

  const orderStatusLabels: Record<OrderStatus, string> = {
    new: t.new,
    processing: t.processing,
    shipped: t.shipped,
    cancelled: t.cancelled,
  };

  const paymentStatusLabels: Record<PaymentStatus, string> = {
    paid: t.paid,
    unpaid: t.unpaid,
  };

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Failed to load orders", err));
  }, []);

  const filteredOrders = orders
    .filter((order) => {
      const query = searchTerm.toLowerCase();
      return (
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_email.toLowerCase().includes(query) ||
        order.customer_phone.toLowerCase().includes(query) ||
        order.order_id.toString().includes(query)
      );
    })
    .filter((order) => {
      if (!startDate && !endDate) return true;
      const createdAt = new Date(order.created_at);
      if (startDate && createdAt < startDate) return false;
      if (endDate && createdAt > endDate) return false;
      return true;
    });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (itemSum: number, item: { total_price: string }) =>
          itemSum + parseFloat(item.total_price),
        0
      )
    );
  }, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const exportToExcel = () => {
    const data = orders.map((order) => ({
      OrderID: order.order_id,
      Name: order.customer_name,
      Email: order.customer_email,
      Phone: order.customer_phone,
      Address: order.address,
      Date: new Date(order.created_at).toLocaleString(),
      Status: order.status,
      Total: order.items
        .reduce(
          (sum: number, item: { total_price: string }) =>
            sum + parseFloat(item.total_price),
          0
        )
        .toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "orders.xlsx");
  };

  const exportToPDF = async () => {
    const element = document.getElementById("orders-container");
    if (!element) return alert("Element not found");

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("orders.pdf");
  };

return (
  <div id="orders-container" className="space-y-6">
    <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg shadow-sm text-indigo-900 dark:text-white text-sm font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>📦 {t.totalOrders}: {totalOrders}</div>
      <div>💰 {t.totalRevenue}: ${totalRevenue.toFixed(2)}</div>
    </div>

    {currentOrders.map((order) => {
      const totalInvoice = order.items.reduce((sum: number, item: { total_price: string; }) => sum + parseFloat(item.total_price as string), 0);

      return (
        <div key={order.order_id} className="rounded-xl shadow border border-indigo-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1 text-sm text-gray-800 dark:text-gray-200">
              <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                #{order.order_id}
              </div>
              <div>{new Date(order.created_at).toLocaleString(locale)}</div>
              <div>{order.customer_name} | {order.customer_email} | {order.customer_phone}</div>
              <div>{order.address}</div>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-3">
              <div className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {paymentStatusLabels[order.payment_status]}
                </span>
                <select
                  value={order.payment_status}
                  onChange={async (e) => {
                    const newPaymentStatus = e.target.value as PaymentStatus;
                    const res = await fetch(`/api/admin/orders/${order.order_id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ payment_status: newPaymentStatus }),
                    });
                    if (res.ok) {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.order_id === order.order_id ? { ...o, payment_status: newPaymentStatus } : o
                        )
                      );
                    }
                  }}
                  className="border rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                >
                  <option value="unpaid">{t.unpaid}</option>
                  <option value="paid">{t.paid}</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(order.status)}`}>
                  {orderStatusLabels[order.status]}
                </span>
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as OrderStatus;
                    const res = await fetch(`/api/admin/orders/${order.order_id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: newStatus }),
                    });
                    if (res.ok) {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.order_id === order.order_id ? { ...o, status: newStatus } : o
                        )
                      );
                    }
                  }}
                  className="border rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                >
                  <option value="new">{t.new}</option>
                  <option value="processing">{t.processing}</option>
                  <option value="shipped">{t.shipped}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </div>


                {/* Buttons */}
                <button
                  onClick={exportToExcel}
                  className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded shadow-sm"
                >
                  📊
                </button>
                <button
                  onClick={exportToPDF}
                  className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded shadow-sm"
                >
                  📄
                </button>
                <button
                  onClick={async () => {
                    if (confirm(t.deleteConfirm)) {
                      const res = await fetch(
                        `/api/admin/orders/${order.order_id}`,
                        { method: "DELETE" }
                      );
                      if (res.ok) {
                        setOrders((prev) =>
                          prev.filter((o) => o.order_id !== order.order_id)
                        );
                      }
                    }
                  }}
                  className="text-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded shadow-sm"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border mt-3 border-gray-300 dark:border-gray-600">
                <thead className="bg-indigo-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-medium">
                  <tr>
                    <th className="p-2 border">{t.product}</th>
                    <th className="p-2 border text-center">{t.quantity}</th>
                    <th className="p-2 border text-right">{t.price}</th>
                    <th className="p-2 border text-right">{t.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(
                    (
                      item: {
                        product_name:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        quantity:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<
                                  unknown,
                                  string | JSXElementConstructor<any>
                                >
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined;
                        price: string;
                        total_price: string;
                      },
                      index: Key | null | undefined
                    ) => (
                      <tr
                        key={index}
                        className="text-gray-800 dark:text-gray-100"
                      >
                        <td className="p-2 border">{item.product_name}</td>
                        <td className="p-2 border text-center">
                          {item.quantity}
                        </td>
                        <td className="p-2 border text-right">
                          ${parseFloat(item.price).toFixed(2)}
                        </td>
                        <td className="p-2 border text-right">
                          ${parseFloat(item.total_price).toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                  <tr className="bg-indigo-100 dark:bg-indigo-900 font-semibold">
                    <td colSpan={3} className="p-2 border text-right">
                      {t.total}
                    </td>
                    <td className="p-2 border text-right">
                      ${totalInvoice.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded disabled:opacity-50"
          >
            ◀️ {t.previous}
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-200">
            {t.page} {currentPage} {t.of} {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded disabled:opacity-50"
          >
            {t.next} ▶️
          </button>
        </div>
      )}
    </div>
  );
}
