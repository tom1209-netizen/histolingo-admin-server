import Country from "../models/country.model.js";

class CountryService {
    async createCountry(name, description, image, localeData) {
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
    async updateCountry(id, updateData) {
        try {
            const updatedCountry = await Country.findByIdAndUpdate(id, updateData, { new: true });
            return updatedCountry;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async getCountries(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Country.aggregate([
            { $match: filters },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                    ]
                }
            }
        ]);

        const totalCountriesCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const countries = results[0].documents;

        return { countries, totalCountriesCount };
    }

    async getCountry(id) {
        const country = await Country.findById({ _id: id });
        return country;
    }
}

const countryService = new CountryService();

export default countryService;