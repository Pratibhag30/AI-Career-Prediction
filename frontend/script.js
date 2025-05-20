document.getElementById('careerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

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
        document.getElementById('output').innerHTML = JSON.stringify(data.response, null, 2);
        document.getElementById('result').classList.remove('hidden');
    } else {
        alert(data.message);
    }
});
