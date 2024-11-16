document.getElementById('tourist-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const touristInfo = {
        name: formData.get('name'),
        age: formData.get('age'),
        sex: formData.get('sex'),
        valid_id: formData.get('valid_id'),
        nationality: formData.get('nationality')
    };

    console.log(touristInfo);

    alert('Registration successful! Your information has been recorded.');
    this.reset(); // Reset the form after submission
});
