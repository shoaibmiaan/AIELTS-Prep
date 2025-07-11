# IELTS Platform Development Roadmap (with Working Filter)

## Interactive Status Filter
<div class="status-filter">
  <select id="statusFilter" onchange="filterTable()">
    <option value="all">All Items</option>
    <option value="done">✅ Done</option>
    <option value="progress">🟡 In Progress</option>
    <option value="pending">❌ Pending</option>
  </select>
  <span id="counter">Showing 45/45 items</span>
</div>

## Roadmap Table
<table id="roadmapTable">
  <thead>
    <tr>
      <th>Main Goal</th>
      <th>Phase</th>
      <th>Objective</th>
      <th>Target</th>
      <th>Strategy</th>
      <th onclick="sortTable(5)">Status ▲▼</th>
    </tr>
  </thead>
  <tbody>
    <tr data-status="done">
      <td>User Module</td>
      <td>Phase 1</td>
      <td>User registration</td>
      <td>Implement authentication</td>
      <td>Firebase Integration</td>
      <td>✅ Done</td>
    </tr>
    <tr data-status="progress">
      <td>Learning Module</td>
      <td>Phase 1</td>
      <td>Course library</td>
      <td>Build categories</td>
      <td>CMS Design</td>
      <td>🟡 In Progress</td>
    </tr>
    <!-- More rows... -->
  </tbody>
</table>

<script>
// Working Filter Implementation
function filterTable() {
  const filter = document.getElementById("statusFilter").value;
  const rows = document.querySelectorAll("#roadmapTable tbody tr");
  let visibleCount = 0;

  rows.forEach(row => {
    if (filter === "all" || row.getAttribute("data-status") === filter) {
      row.style.display = "";
      visibleCount++;
    } else {
      row.style.display = "none";
    }
  });
  
  document.getElementById("counter").textContent = 
    `Showing ${visibleCount}/${rows.length} items`;
}

// Bonus: Sorting Function
function sortTable(column) {
  //...sorting logic here
}
</script>

<style>
.status-filter {
  margin: 20px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

#statusFilter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

#roadmapTable th {
  cursor: pointer;
}
</style>