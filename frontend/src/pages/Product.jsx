import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Product.css'; // Custom styles

// Demo products data
const products = [
    {
        id: 1,
        name: 'Avocado',
        description: 'A creamy fruit that is high in healthy fats.',
        image: 'https://static.vecteezy.com/system/resources/previews/030/675/822/large_2x/product-shots-of-avacado-high-quality-4k-ultra-free-photo.jpg',
        nutrition: 'Calories: 160, Fat: 15g, Carbs: 9g, Protein: 2g',
    },
    {
        id: 2,
        name: 'Banana',
        description: 'A sweet fruit rich in potassium and fiber.',
        image: 'https://images8.alphacoders.com/614/614485.jpg',
        nutrition: 'Calories: 105, Fat: 0g, Carbs: 27g, Protein: 1g',
    },
    {
        id: 3,
        name: 'Chicken Breast',
        description: 'A lean source of protein, perfect for healthy meals.',
        image: 'https://www.olivado.com/wp-content/uploads/2020/07/55_172_chicken-bbq-1.jpg',
        nutrition: 'Calories: 165, Fat: 3.6g, Carbs: 0g, Protein: 31g',
    },
    {
        id: 4,
        name: 'Broccoli',
        description: 'A nutritious vegetable packed with vitamins and minerals.',
        image: 'https://www.products.sumika-agrotech.com/international/uploads/2023072101071264ba04709fcb4.jpg',
        nutrition: 'Calories: 55, Fat: 0.6g, Carbs: 11g, Protein: 4g',
    },
    {
        id: 5,
        name: 'Quinoa',
        description: 'A protein-rich grain that is gluten-free.',
        image: 'https://images7.alphacoders.com/103/thumb-1920-1035665.jpg',
        nutrition: 'Calories: 222, Fat: 3.6g, Carbs: 39g, Protein: 8g',
    },
    {
        id: 6,
        name: 'Salmon',
        description: 'A fatty fish that is a great source of omega-3 fatty acids.',
        image: 'https://images4.alphacoders.com/106/1065904.jpg',
        nutrition: 'Calories: 206, Fat: 13g, Carbs: 0g, Protein: 22g',
    },
];

const Product = () => {
    return (
        <div className="container"
             // style={{position:"absolute"}}
        >
            &nbsp;
            &nbsp;
            <h1 className="text-danger text-center mb-4">Sample Work</h1>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4 mb-4 d-flex justify-content-center" key={product.id}>
                        <div className="card bg-danger text-white h-100"> {/* Added h-100 for full height */}
                            <img src={product.image} alt={product.name} className="card-img-top consistent-img" />
                            <div className="card-body d-flex flex-column"> {/* Flexbox for equal height */}
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>Nutrition:</strong> {product.nutrition}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;
