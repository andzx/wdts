Proposal = require('./../models/proposal');

async function getProposals(jobId) {
    // Start a new transaction
    let transaction;
    try {
        transaction = await db.transaction();
        
        // Get a jobs proposals
        return proposals = await Proposal.findAll({where: {job_id: jobId}}) || false;
    } catch (error) {
        utils.log(error);
    }
}

function getJobsProposals(server) {
    server.get('/api/company/:companyId/job/:jobId/proposals', function(req, res, next) {
        if(!req.params.jobId) {
            res.send(400);
            return next();
        }
        
        // Check if the company belongs to this user
        // bugged out, didn't finish 
        /*if (!req._user.companyIds.includes(req.params.companyId)) {
            res.send(401);
            return next();
        }*/

        // Get proposals
        getProposals(req.params.jobId).then((proposals) => {
            if (!proposals) {
                res.send(404);
                return next();
            }
            
            // Send response
            res.send(200, proposals);
            return next();
        });
    });
};

module.exports = getJobsProposals;