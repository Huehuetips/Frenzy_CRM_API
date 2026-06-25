import { RequestHandler } from 'express';

import { CreateActivityInput } from './activities.schema';
import * as activitiesService from './activities.service';

export const create: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const activity = await activitiesService.create(id, req.body as CreateActivityInput);

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

export const findByLeadId: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const activities = await activitiesService.findByLeadId(id);

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};
