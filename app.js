
import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const form = document.getElementById("sale-form");
const salesTable = document.getElementById("salesTable");

// ฟังก์ชันเพิ่มข้อมูล
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        customerName: form.customerName.value,
        itemDetail: form.itemDetail.value,
        buyPrice: parseFloat(form.buyPrice.value),
        sellPrice: parseFloat(form.sellPrice.value),
        profit: parseFloat(form.sellPrice.value) - parseFloat(form.buyPrice.value),
        paymentType: form.paymentType.value,
        date: new Date().toISOString(),
    };

    await addDoc(collection(db, "sales"), data);
    form.reset();
    loadSales();
});

// โหลดข้อมูลทั้งหมด
async function loadSales() {
    salesTable.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "sales"));
    let totalSales = 0;
    let totalProfit = 0;

    querySnapshot.forEach((docSnap) => {
        const sale = docSnap.data();
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${sale.customerName}</td>
      <td>${sale.itemDetail}</td>
      <td>${sale.buyPrice}</td>
      <td>${sale.sellPrice}</td>
      <td>${sale.profit}</td>
      <td>${sale.paymentType}</td>
      <td><button onclick="deleteSale('${docSnap.id}')">ลบ</button></td>
    `;
        salesTable.appendChild(tr);

        totalSales += sale.sellPrice;
        totalProfit += sale.profit;
    });

    document.getElementById("today-sales").textContent = totalSales.toLocaleString();
    document.getElementById("today-profit").textContent = totalProfit.toLocaleString();
}

// ลบข้อมูล
window.deleteSale = async (id) => {
    await deleteDoc(doc(db, "sales", id));
    loadSales();
};

loadSales();
