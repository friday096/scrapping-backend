const constant = require('../utils/constant')
const {createScrap, getAllScraps, getScrapById, deleteScrap } = require('../service/scrap.service');

exports.createScrap = async (req, res) => {
    try {
        let data = req.body
        createScrap(data, (err, result) => {
          if (err) {
              console.log('throw-err', err);
              res.status(500).send({
                  status: constant.error_code,
                  message:err.message
              });
          } else {
              res.status(200).send({
                  status: constant.success_code,
                  message: "Scrap create successfully",
                  data: result.data
              });
          }
      });

    } catch (err) {
        res.send({
            status: constant.error_code,
            message: err.message
        })
    }
}

exports.getAllScraps = async (req, res) => {
    try {
        getAllScraps((err, result) => {
          if (err) {
              console.log('throw-err', err);
              res.status(500).send({
                  status: constant.error_code,
                  message:err.message
              });
          } else {
              res.status(200).send({
                  status: constant.success_code,
                  message: "Scrap get successfully",
                  data: result.data
              });
          }
      });

    } catch (err) {
        res.send({
            status: constant.error_code,
            message: err.message
        })
    }
}

exports.getScrapById = async (req, res) => {
    try {
        const { id } = req.params;
        getScrapById(id, (err, result) => {
          if (err) {
              console.log('throw-err', err);
              res.status(500).send({
                  status: constant.error_code,
                  message:err.message
              });
          } else {
              res.status(200).send({
                  status: constant.success_code,
                  message: "Scrap create successfully",
                  data: result.data
              });
          }
      });

    } catch (err) {
        res.send({
            status: constant.error_code,
            message: err.message
        })
    }
}

exports.deleteScrap = async (req, res) => {
    try {
        const { ids } = req.body;

        deleteScrap(ids, (err, result) => {
            if (err) {
                console.log('throw-err', err);
                return res.status(500).send({
                    status: constant.error_code,
                    message: err.message
                });
            }
            
            return res.status(200).send({
                status: constant.success_code,
                message: result.message,
            });
        });
    } catch (err) {
        return res.status(500).send({
            status: constant.error_code,
            message: err.message
        });
    }
};