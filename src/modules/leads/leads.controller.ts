import { RequestHandler } from 'express';

import {
  ChangeStatusInput,
  CreateLeadInput,
  QueryLeadsInput,
  UpdateLeadInput
} from './leads.schema';
import * as leadsService from './leads.service';

export const create: RequestHandler = async (req, res, next) => {
  try {
    const lead = await leadsService.create(req.body as CreateLeadInput);

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const findAll: RequestHandler = async (req, res, next) => {
  try {
    const result = await leadsService.findAll(req.query as unknown as QueryLeadsInput);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const findById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const lead = await leadsService.findById(id);

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const lead = await leadsService.update(id, req.body as UpdateLeadInput);

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    await leadsService.remove(id);

    res.status(200).json({
      success: true,
      message: 'Lead eliminado'
    });
  } catch (error) {
    next(error);
  }
};

export const changeStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const { statusLead } = req.body as ChangeStatusInput;
    const lead = await leadsService.changeStatus(id, statusLead);

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};
