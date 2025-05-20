 const loader = document.getElementById("loader");

document.getElementById('careerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

     loader.style.display = "block";

    const skills = document.getElementById('skills').value.split(',').map(s => s.trim());
    const interests = document.getElementById('interests').value.split(',').map(i => i.trim());
    const aptitude = document.getElementById('aptitude').value;

    const response = await fetch('/api/predict-career', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills, interests, aptitude }),
    });

    const data = await response.json();
 if (data.success) {
  let response = data.response; // assuming it's a string

  // Replace **bold**
  response = response.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Replace numbered list (e.g., 1. Text)
  response = response.replace(/^(\d+)\.\s(.+)$/gm, "<h4>$1. $2</h4>");

  // Replace bullet list (* or -) with <ul><li>
  response = response.replace(/(?:\n|^)[*-] (.+)/g, "<li>$1</li>");

  // Wrap <li> in <ul> if not already wrapped
  response = response.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

  // Replace new lines with <br> where necessary
  response = response.replace(/\n/g, "<br>");

  loader.style.display = "none";

  // Display in container
  document.getElementById('output').innerHTML = response;
  document.getElementById('result').classList.remove('hidden');
}

 else {
        alert(data.message);
    }
});
