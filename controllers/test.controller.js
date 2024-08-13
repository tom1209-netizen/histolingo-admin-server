import Admin from '../models/admin.model.js';
import Test from '../models/test.model.js';
import testService from '../services/test.service.js';
import { applyRequestContentLanguage } from '../utils/localization.util.js';

export const getTopicsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = '' } = req.query;
        const searchCondition = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { adminName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const admins = await Admin.find(searchCondition, 'firstName lastName adminName _id'); // Chỉ lấy ra các trường cần thiết

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.admin.name") }),
            data: admins
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};


export const getCountriesController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = '' } = req.query;
        const searchCondition = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { adminName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const admins = await Admin.find(searchCondition, 'firstName lastName adminName _id'); // Chỉ lấy ra các trường cần thiết

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.admin.name") }),
            data: admins
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const createTestController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionNumber, topicId, countryId, localeData } = req.body;
        const createdBy = req.admin._id;
        const questions = req.questions;

        const newTest = await testService.createTest(name, createdBy, documentationsId, questionNumber, topicId, countryId, questions, localeData);

        return res.status(201).json({
            success: true,
            message: __("message.createdSuccess", { field: __("model.test.name") }),
            status: 201,
            data: {
                test: {
                    id: newTest._id,
                    name: newTest.name,
                    createdBy: newTest.createdBy,
                    documentationsId: newTest.documentationsId,
                    questionNumber: newTest.questionNumber,
                    topicId: newTest.topicId,
                    countryId: newTest.countryId,
                    localeData: newTest.localeData
                },
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const updateTestController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const test = req.test;
        const updateData = req.body;

        const updatedTest = await testService.updateDocumentation(test, updateData);

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.test.name") }),
            status: 200,
            data: {
                updatedTest: {
                    id: updatedTest._id,
                    name: updatedTest.name,
                    createdBy: updatedTest.createdBy,
                    documentationsId: updatedTest.documentationsId,
                    questionNumber: updatedTest.questionNumber,
                    topicId: updatedTest.topicId,
                    countryId: updatedTest.countryId,
                    localeData: updatedTest.localeData
                }
            }
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getListTestController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { search = '', page = 1, page_size = 10, sortOrder = 1, status } = req.query;

        const searchCondition = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { countryName: { $regex: search, $options: 'i' } },
                    { topicName: { $regex: search, $options: 'i' } },
                ]
            }
            : {};
        if (status !== null && status !== undefined && status !== "") {
            searchCondition.status = status;
        }

        const tests = await testService.getListTests(searchCondition, page, page_size, sortOrder);

        const totalTests = await Test.countDocuments(searchCondition);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.test.name") }),
            data: {
                tests,
                totalPages: Math.ceil(totalTests / page_size),
                totalCount: totalTests,
                currentPage: Number(page)
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getTestByIdController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const id = req.params.id;
        const test = await testService.getTest(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.test.name") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.test.name") }),
                status: 200,
                data: {
                    test: {
                        id: test._id,
                        name: test.name,
                        createdBy: test.createdBy,
                        documentationsId: test.documentationsId,
                        questionNumber: test.questionNumber,
                        topicId: test.topicId,
                        countryId: test.countryId,
                        localeData: test.localeData
                    }
                }
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};