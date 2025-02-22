import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

function CreateProductForm() {
    const { user } = useAuth();
    const [product, setProduct] = React.useState({
        name: '',
        quantity: '',
        expiryDate: new Date(),
        category: '',
        reorderPoint: '',
        dosageInstructions: '',
        image: '',
    });
    const [showPicker, setShowPicker] = React.useState(false);

    const categories = ['Medicine', 'Injection', 'Medical Supplies', 'Others'];

    const handleChange = (name, value) => {
        setProduct({ ...product, [name]: value });
    };

    const onChange = ({ type }, selectedDate) => {
        if (type === 'set' && selectedDate) {
            setShowPicker(false);
            setProduct({ ...product, expiryDate: selectedDate });
        } else {
            setShowPicker(false);
        }
    };

    return (
        <View>
            <Text>Create Product Form</Text>
            <TextInput
                placeholder="Product Name"
                value={product.name}
                onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
                placeholder="Quantity"
                value={product.quantity}
                onChangeText={(text) => handleChange('quantity', text)}
            />

            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text>Add Expiry Date</Text>
            </TouchableOpacity>

            <Text>Selected Date: {product.expiryDate.toDateString()}</Text>

            {showPicker && (
                <DateTimePicker
                    mode='date'
                    display='spinner'
                    value={product.expiryDate}
                    onChange={onChange}
                    minimumDate={new Date()}
                />
            )}

            <Picker
                selectedValue={product.category}
                onValueChange={(itemValue) => handleChange('category', itemValue)}
            >
                {categories.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                ))}
            </Picker>
        </View>
    );
}

export default CreateProductForm;
