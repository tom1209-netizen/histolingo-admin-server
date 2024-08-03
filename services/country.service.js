import Country from "../models/country.model.js";

class CountryService {
    async createCountry(name, description, image, localeData) {
        console.log(localeData);
        const newCountry = await Country.create(
            {
                name,
                description,
                image,
                localeData
            }
        );
        return newCountry;
    }
    async updateCountry(country, updateData) {
        try {
            const updatedCountry = await Country.findOneAndUpdate(country, updateData, { new: true });
            return updatedCountry;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }
}

const countryService = new CountryService();

export default countryService;