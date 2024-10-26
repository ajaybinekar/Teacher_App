let currentStudentId = null;

function openNewStudentModal() {
  currentStudentId = null;
  document.getElementById('studentForm').reset();
  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

function editStudent(studentId) {
  currentStudentId = studentId;
  const row = document.getElementById(`student-${studentId}`);
  const cells = row.getElementsByTagName('td');

  document.getElementById('studentName').value = cells[0].textContent;
  document.getElementById('studentSubject').value = cells[1].textContent;
  document.getElementById('studentMarks').value = cells[2].textContent;

  new bootstrap.Modal(document.getElementById('studentModal')).show();
}

function saveStudent() {
  const data = {
    student: {
      name: document.getElementById('studentName').value,
      subject: document.getElementById('studentSubject').value,
      marks: parseInt(document.getElementById('studentMarks').value)
    }
  };

  const url = currentStudentId ? 
    `/students/${currentStudentId}` : 
    '/students';

  const method = currentStudentId ? 'PATCH' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      const tableBody = document.getElementById('students-table-body');
      const row = document.getElementById(`student-${currentStudentId}`);

      if (row) {
        row.cells[0].textContent = data.student.name;
        row.cells[1].textContent = data.student.subject;
        row.cells[2].textContent = data.student.marks;
      } else {
        const newRow = tableBody.insertRow();
        newRow.id = `student-${data.student.id}`;

        newRow.innerHTML = `
          <td>${data.student.name}</td>
          <td>${data.student.subject}</td>
          <td>${data.student.marks}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editStudent(${data.student.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteStudent(${data.student.id})">Delete</button>
          </td>
        `;
      }

      new bootstrap.Modal(document.getElementById('studentModal')).hide();
    } else {
      alert('Error: ' + data.message);
    }
  })
  .catch(error => console.error('Error:', error));
}

function deleteStudent(studentId) {
  if (confirm('Are you sure you want to delete this student?')) {
    fetch(`/students/${studentId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        const row = document.getElementById(`student-${studentId}`);
        row.parentNode.removeChild(row);
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(error => console.error('Error:', error));
  }
}