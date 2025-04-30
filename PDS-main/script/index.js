document.getElementById('fileInput').addEventListener('change', handleFile, false);

function handleFile(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });

        let firstSheetName = workbook.SheetNames[0];
        let sheet = workbook.Sheets[firstSheetName];

        let rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Convert raw data (array of arrays) to an array of objects
        let headers = rawData[0]; // First row as keys
        let jsonData = rawData.slice(1).map(row => {
            let obj = {};
            headers.forEach((key, index) => {
                obj[key] = row[index] || ""; // Assign values, default to empty string if undefined
            });
            return obj;
        });

        // Store data in localStorage
        localStorage.setItem("excelData", JSON.stringify(jsonData));

        displayData(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

function loadStoredData() {
    let storedData = localStorage.getItem("excelData");
    if (storedData) {
        let jsonData = JSON.parse(storedData);
        displayData(jsonData);
    }
}

function clearStorage() {
    localStorage.removeItem("excelData");
    document.getElementById("dataTable").innerHTML = "";
    alert("LocalStorage cleared!");
}

// Load stored data on page load
loadStoredData();

//Live search
document.getElementById('searchInput').addEventListener('input', function () {
    let filter = this.value.toUpperCase();
    let table = document.getElementById('dataTable');
    let tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) { // Start at 1 to skip header
        let tds = tr[i].getElementsByTagName('td');
        let rowText = "";

        for (let td of tds) { 
            rowText += td.textContent || td.innerText; // Concatenate text from all columns
        }

        tr[i].style.display = rowText.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
    }
});

    
// Everything start here
function displayData(data) {
    if (!data) {
        console.log("No data to display");
        return;
    }
    console.log(data);
    let table = document.getElementById("dataTable");
    table.innerHTML = `
        <tr>
            <th></th>
            <th>#</th>
            <th>Rank</th>
            <th>Firstname</th>
            <th>Middlename</th>
            <th>Lastname</th>
            <th>Badge #</th>
            <th>Designation</th>
            <th>Station</th>
            <th>Substation</th>
        </tr>
    `;
    data.forEach((row, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>></td>
            <td>${index + 1}</td>
            <td>${row.RANK}</td>
            <td>${row.FIRSTNAME}</td>
            <td>${row.MIDDLENAME}</td>
            <td>${row.LASTNAME}</td>
            <td>${row.BADGE_NO}</td>
            <td>${row.DESIGNATION}</td>
            <td>${row.STATION}</td>
            <td>${row.SUB_STATION}</td>
        `;

        tr.addEventListener("click", function () {
            let existingDetailRow = document.querySelector(".detail-row");

            // If the clicked row is already selected, remove highlight and close the detail row
            if (tr.classList.contains("selected")) {
                tr.classList.remove("selected");
                tr.style.backgroundColor = "";
                if (existingDetailRow) existingDetailRow.remove();
                return;
            }

            // Remove previous highlight and detail row
            document.querySelectorAll("#dataTable tr").forEach(r => {
                r.classList.remove("selected");
                r.style.backgroundColor = "";
            });
            if (existingDetailRow) existingDetailRow.remove();

            // Highlight the selected row
            tr.classList.add("selected");
            tr.style.backgroundColor = "#F1F5F9";

            // Insert a new row below with three buttons
            let detailRow = document.createElement("tr");
            detailRow.classList.add("detail-row");
            detailRow.innerHTML = `
                <td class="row-detail" colspan="10">
                    <button onclick="alert(${row.BADGE_NO})">View all data</button>
                    <button onclick="alert('Delete clicked')">Education Background</button>
                    <button onclick="alert('View clicked')">trainings</button>
                    <button onclick="alert('View clicked')">Issued Fire arms</button>
                </td>
            `;

            tr.after(detailRow);
        });

        table.appendChild(tr);
    });
}




