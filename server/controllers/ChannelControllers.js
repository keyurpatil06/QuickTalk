import User from '../models/UserModel.js';
import Channel from '../models/ChannelModel.js';
import mongoose from 'mongoose';

export const createChannel = async (request, response, next) => {
    try {
        const { name, members } = request.body;
        const userId = request.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return response.status(400).send('Admin not found');
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return response.status(400).send('Some members are not valid users.');
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save();
        return response.status(201).json({ channel: newChannel });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Inernal Server Error");
    }
};

export const getUserChannel = async (request, response, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(request.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ UpdatedAt: -1 });

        return response.status(201).json({ channels });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Inernal Server Error");
    }
};