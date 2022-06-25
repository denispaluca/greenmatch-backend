import { RequestHandler } from "express";
import * as OfferService from '../services/offer';
import * as OfferUtils from '../utils/offer';


export const list: RequestHandler = async (req, res) => {
  try {
    const offers = await OfferService.list(OfferUtils.parseQuery(req.query));
    res.status(200).json(offers);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message
    })
  }
}

export const get: RequestHandler = async (req, res) => {
  try {
    const offer = await OfferService.get(req.params.id);
    if (!offer) {
      return res.status(404).json({
        error: 'Offer not found',
        message: `Offer with id ${req.params.id} doesn't exist`
      })
    }

    return res.status(200).json(offer);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message
    })
  }
}