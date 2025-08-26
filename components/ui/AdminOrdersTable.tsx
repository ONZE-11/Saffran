"use client";

import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { translations } from "@/lib/translations";
import { useLocale } from "@/context/locale-context";

export default function AdminOrdersTable() {
  const { locale } = useLocale();

  type OrderStatus = "new" | "processing" | "shipped" | "cancelled";
  type PaymentStatus = "paid" | "unpaid";

  type OrderItem = {
    product_name: string;
    quantity: number;
    price: string | number;
    total_price: string | number;
  };

  type Order = {
    items: OrderItem[];
    order_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    address: string;
    created_at: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const t = translations[locale].common;
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ formatter for Euro
  const currencyFormatter = new Intl.NumberFormat(
    locale === "es" ? "es-ES" : "en-GB",
    {
      style: "currency",
      currency: "EUR",
    }
  );

  // ✅ formatter for Spain datetime → YYYY-MM-DD HH:mm
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const optionsDate: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit",
    };

    const [day, month, year] = date
      .toLocaleDateString("es-ES", optionsDate)
      .split("/"); // ["26","08","2025"]

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = date.toLocaleTimeString("es-ES", optionsTime);

    return `${formattedDate} , ${formattedTime}`;
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
      const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      if (start && createdAt < start) return false;
      if (end && createdAt > end) return false;
      return true;
    });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => {
    return (
      sum +
      (Array.isArray(order.items)
        ? order.items.reduce((itemSum, item) => {
            const price =
              typeof item.total_price === "string"
                ? parseFloat(item.total_price)
                : item.total_price;
            return itemSum + (isNaN(price) ? 0 : price);
          }, 0)
        : 0)
    );
  }, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage)
  );

  const exportToExcel = () => {
    const data = filteredOrders.map((order) => {
      const total = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => {
            const price =
              typeof item.total_price === "string"
                ? parseFloat(item.total_price)
                : item.total_price;
            return sum + (isNaN(price) ? 0 : price);
          }, 0)
        : 0;
      return {
        OrderID: order.order_id,
        Name: order.customer_name,
        Email: order.customer_email,
        Phone: order.customer_phone,
        Address: order.address,
        Date: formatDateTime(order.created_at), // ✅ formatted datetime
        Status: order.status,
        Payment: order.payment_status,
        Total: currencyFormatter.format(total),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "orders.xlsx");
  };

  const exportToPDF = async () => {
    const element = document.getElementById("orders-container");
    if (!element) return alert("Element not found");
    const canvas = await html2canvas(element, { backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("orders.pdf");
  };

  const handleDelete = async (orderId: number) => {
    const confirmed = confirm(
      t.deleteConfirm || "Are you sure you want to delete this order?"
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const updatedOrders = orders.filter((o) => o.order_id !== orderId);
      setOrders(updatedOrders);

      const remainingItemsOnPage = updatedOrders.slice(
        indexOfFirstItem,
        indexOfLastItem
      );

      if (remainingItemsOnPage.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      alert(t.orderError || "Failed to delete order.");
    }
  };

  return (
    <div id="orders-container" ref={containerRef} className="space-y-6">
      <div className="mb-4 p-4 bg-indigo-100 dark:bg-indigo-800 rounded-lg shadow-sm text-sm font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-indigo-800 dark:text-white">
          📦 {t.totalOrders}: {totalOrders}
        </div>
        <div className="text-indigo-800 dark:text-white">
          💰 {t.totalRevenue}: {currencyFormatter.format(totalRevenue)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Excel
          </button>
          <button
            onClick={exportToPDF}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            PDF
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.search || "Search..."}
          className="px-3 py-2 text-sm transition bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500"
        />

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText={t.from || "From"}
          dateFormat="yyyy-MM-dd"
          className="px-3 py-2 text-sm transition bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText={t.to || "To"}
          dateFormat="yyyy-MM-dd"
          className="px-3 py-2 text-sm transition bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-500"
        />
      </div>

      {/* order list */}
      {currentOrders.map((order) => {
        const totalInvoice = order.items.reduce(
          (sum: number, item) => sum + parseFloat(item.total_price as string),
          0
        );
        const totalQuantity = order.items.reduce(
          (sum: number, item) => sum + Number(item.quantity),
          0
        );
        return (
          <div
            key={order.order_id}
            className="rounded-2xl p-5 bg-white dark:bg-gray-900 border shadow-lg transition-shadow duration-300 hover:[box-shadow:0_4px_20px_#4b5563] dark:hover:[box-shadow:0_4px_20px_#c7d2f7]"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-bold text-indigo-700 dark:text-indigo-300">
                  #{order.order_id}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {formatDateTime(order.created_at)}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  {order.customer_name} | {order.customer_email} |{" "}
                  {order.customer_phone}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {order.address}
                </div>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200">
                🛒 {totalQuantity} | 💰 {currencyFormatter.format(totalInvoice)}
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {/* payment status */}
                <select
                  value={order.payment_status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as PaymentStatus;
                    const res = await fetch(
                      `/api/admin/orders/${order.order_id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ payment_status: newStatus }),
                      }
                    );
                    if (res.ok) {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.order_id === order.order_id
                            ? { ...o, payment_status: newStatus }
                            : o
                        )
                      );
                    }
                  }}
                  className={`text-xs px-2 py-1 rounded border dark:text-white ${
                    order.payment_status === "paid"
                      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                  }`}
                >
                  <option value="unpaid">{t.unpaid}</option>
                  <option value="paid">{t.paid}</option>
                </select>

                {/* order status */}
                <select
                  value={order.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as OrderStatus;
                    const res = await fetch(
                      `/api/admin/orders/${order.order_id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus }),
                      }
                    );
                    if (res.ok) {
                      setOrders((prev) =>
                        prev.map((o) =>
                          o.order_id === order.order_id
                            ? { ...o, status: newStatus }
                            : o
                        )
                      );
                    }
                  }}
                  className={`text-xs px-2 py-1 rounded border dark:text-white ${
                    order.status === "new"
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      : order.status === "processing"
                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                      : order.status === "shipped"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  }`}
                >
                  <option value="new">{t.new}</option>
                  <option value="processing">{t.processing}</option>
                  <option value="shipped">{t.shipped}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>

                {/* delete */}
                <button
                  onClick={() => handleDelete(order.order_id)}
                  className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-all duration-200 flex items-center gap-1"
                >
                  🗑️{" "}
                  <span className="hidden sm:inline">
                    {t.delete || "Delete"}
                  </span>
                </button>
              </div>
            </div>

            {/* items table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-indigo-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                  <tr>
                    <th className="p-2 border text-center">{t.product}</th>
                    <th className="p-2 border text-center">{t.quantity}</th>
                    <th className="p-2 border text-center">{t.price}</th>
                    <th className="p-2 border text-center">{t.total}</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border text-center text-gray-800 dark:text-gray-100">
                        {item.product_name}
                      </td>
                      <td className="p-2 border text-center text-gray-800 dark:text-gray-100">
                        {item.quantity}
                      </td>
                      <td className="p-2 border text-center text-gray-800 dark:text-gray-100">
                        {currencyFormatter.format(
                          parseFloat(item.price.toString())
                        )}
                      </td>
                      <td className="p-2 border text-center text-gray-800 dark:text-gray-100">
                        {currencyFormatter.format(
                          parseFloat(item.total_price.toString())
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-indigo-100 dark:bg-indigo-900 font-semibold">
                    <td className="p-2 border text-center" colSpan={1}>
                      Total
                    </td>
                    <td className="p-2 border text-center">{totalQuantity}</td>
                    <td className="p-2 border text-center"></td>
                    <td className="p-2 border text-center">
                      {currencyFormatter.format(totalInvoice)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* pagination */}
      <div className="flex justify-center items-center gap-4 mt-4 text-sm">
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
            setTimeout(() => {
              document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
          }}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded disabled:opacity-50"
        >
          ◀️ {t.previous || "Previous"}
        </button>

        <span className="text-gray-700 dark:text-white">
          {t.page || "Page"} {currentPage} {t.of || "of"} {totalPages}
        </span>

        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            setTimeout(() => {
              document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
          }}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded disabled:opacity-50"
        >
          {t.next || "Next"} ▶️
        </button>
      </div>
    </div>
  );
}
