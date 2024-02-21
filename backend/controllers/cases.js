const { Case, User } = require("../models");
const calculateScore = require("../config/calculateScore")
const openAI = require("../config/openAI-connection")
const jwt = require("jsonwebtoken")

// console.log(Case);

module.exports = {
  create,
  index,
  show,
  update,
  delete: destroy,
  handleResponse,
  chat
};

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: "2h" }
  )
}

async function create(req, res) {
  // console.log(req.body)
  try {
    console.log("creating case")
    const data = {...req.body}
    data.creator = req.user._id
    console.log("case data: ", data)
    console.log("first of pertinent positive/negative objects: ", data.pertinentPositives[0], data.pertinentNegatives[0])
    res.status(201).json(await Case.create(data));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


async function index(req, res) {
  try {
    res.status(200).json(await Case.find().sort({createdAt: -1}).populate("creator"));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function show(req, res) {
  try {
    res.status(200).json(await Case.findById(req.params.caseId));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function update(req, res) {
  try {
    res
    .status(200)
    .json(
      await Case.findByIdAndUpdate(req.params.caseId, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function destroy(req, res) {
  try {
    res
    .status(200)
    .json(
      await Case.findOneAndDelete({_id: req.params.caseId})
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function handleResponse(req, res) {
  try {
    const response = req.body.selection
    const userId = req?.user?._id
    console.log("userId", userId)
    const caseId = req.params.caseId
    console.log("caseId", caseId)
    let token = null

    const [user, caseStudy] = await Promise.all([
      User.findById(userId),
      Case.findById(caseId)
    ])
    console.log("user", user)
    console.log("casestudy", caseStudy)
    console.log(req.body)

    // tally response, regardless of whether answer is correct or not...
    req.body.priorResponses.forEach(function(response) {
      const responseIdx = caseStudy.multipleChoices.indexOf(response)
      console.log("response idx", responseIdx)
      caseStudy.responses.count[responseIdx] ++
      console.log("mc tally", caseStudy.responses.count[responseIdx])
    })
    const correct = response.toLowerCase() === caseStudy.primaryIllness.toLowerCase()
    // caseStudy.save()

    // if clinician chooses the correct m/c...
    if (req.body.priorResponses.length === 1) {
      caseStudy.responses.correct ++
    } else {
      caseStudy.responses.correct ++
      // if clinician chooses the incorrect m/c
      caseStudy.responses.incorrect + (req.body.priorResponses.length -1)
    }

    // if clinician is logged into acount
    if (user) {
      const score = req.body.score
      user.totalScore+=score
      // let score = 1100
      if (req.body.priorResponses.length === 1) {
        user.completedCases.correct ++
      } else {
        user.completedCases.correct ++
        user.completedCases.incorrect + (req.body.priorResponses.length - 1)
      }
      caseStudy.responses.users.push(userId)
      user.completedCases.casesList.push(caseId)
      const newData = {
        caseId: caseId,
        allResponses: req.body.priorResponses,
        response: caseStudy.primaryIllness.toLowerCase(),
        correct,
        score,
        logOpenAI: req.body.interactions
      }
      user.completedCases.responses.push(newData)
      user.completedCases.responsesMap[caseId] = response
      await user.save()
      token = createJWT(user);
    } else {
      //if clinician is not logged into account
    }

    // await Promise.all([
    //   caseStudy.save()
    // ])

    await caseStudy.save()

    res
    .status(200)
    .json({token, user, caseStudy}
    );
  }catch(err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
}

async function chat(req, res) {
  try {
    const userId = req?.user?._id
    const caseId = req.params.caseId
    const [user, caseStudy] = await Promise.all([
      User.findById(userId),
      Case.findById(caseId)
    ])

  // first, set conditional responses


  // a max of 5 pertinent positives are allowed

  let firstPertPos = null
  if (caseStudy.pertinentPositives.length > 0) {
    firstPertPos = caseStudy?.pertinentPositives[0].pertinentPositiveObject?.pertinentPositive
  }
  // let firstKeywords = caseStudy?.pertinentPositives[0].pertinentPositiveObject?.unlockKeywords
  let firstPertPosKeywords = []
  if (caseStudy.pertinentPositives.length > 0) {
    firstPertPosKeywords = caseStudy?.pertinentPositives[0].pertinentPositiveObject?.unlockKeywords.split(", ")
    console.log(firstPertPosKeywords)
  }

  let secondPertPos = null
  if (caseStudy.pertinentPositives.length > 1) {
      secondPertPos = caseStudy?.pertinentPositives[1].pertinentPositiveObject?.pertinentPositive
    }

  let secondPertPosKeywords = []
  if (caseStudy.pertinentPositives.length > 1) {
    secondPertPosKeywords = caseStudy?.pertinentPositives[1].pertinentPositiveObject?.unlockKeywords.split(", ")
    console.log(secondPertPosKeywords)
  }

  let thirdPertPos = null
  if (caseStudy.pertinentPositives.length > 2) {
      thirdPertPos = caseStudy?.pertinentPositives[2].pertinentPositiveObject?.pertinentPositive
    }

  let thirdPertPosKeywords = []
  if (caseStudy.pertinentPositives.length > 2) {
    thirdPertPosKeywords = caseStudy?.pertinentPositives[2].pertinentPositiveObject?.unlockKeywords.split(", ")
    console.log(thirdPertPosKeywords)
  }

  let fourthPertPos = null
  if (caseStudy.pertinentPositives.length > 3) {
      fourthPertPos = caseStudy?.pertinentPositives[3].pertinentPositiveObject?.pertinentPositive
    }

  let fourthPertPosKeywords = []
  if (caseStudy.pertinentPositives.length > 3) {
    fourthPertPosKeywords = caseStudy?.pertinentPositives[3].pertinentPositiveObject?.unlockKeywords.split(", ")
    console.log(fourthPertPosKeywords)
  }

  let fifthPertPos = null
  if (caseStudy.pertinentPositives.length > 4) {
      fifthPertPos = caseStudy?.pertinentPositives[4].pertinentPositiveObject?.pertinentPositive
    }

  let fifthPertPosKeywords = []
  if (caseStudy.pertinentPositives.length > 4) {
    fifthPertPosKeywords = caseStudy?.pertinentPositives[4].pertinentPositiveObject?.unlockKeywords.split(", ")
    console.log(fifthPertPosKeywords)
  }

  let conditionalResponse1 = false
  let conditionalResponse2 = false
  let conditionalResponse3 = false
  let conditionalResponse4 = false
  let conditionalResponse5 = false


    if (req.body.question.includes((`${firstPertPos}`)) || (firstPertPosKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse1 = true
      console.log("conditional response now true")
    }

    firstPertPosKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse1 = true
          console.log("keyword for perPos present")
        }
    })

  
    if (req.body.question.includes((`${secondPertPos}`)) || (secondPertPosKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse2 = true
      console.log("conditional response now true")
    }

    secondPertPosKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse2 = true
          console.log("keyword for perPos present")
        }
    })


    if (req.body.question.includes((`${thirdPertPos}`)) || (thirdPertPosKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse3 = true
      console.log("conditional response now true")
    }

    thirdPertPosKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse3 = true
          console.log("keyword for perPos present")
        }
    })

    if (req.body.question.includes((`${fourthPertPos}`)) || (fourthPertPosKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse4 = true
      console.log("conditional response now true")
    }

    fourthPertPosKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse4 = true
          console.log("keyword for perPos present")
        }
    })

    if (req.body.question.includes((`${fifthPertPos}`)) || (fifthPertPosKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse5 = true
      console.log("conditional response now true")
    }

    fifthPertPosKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse5 = true
          console.log("keyword for perPos present")
        }
    })

    // a max of 5 pertinent negatives are allowed:

    let firstPertNeg = null
  if (caseStudy.pertinentNegatives.length > 0) {
    firstPertNeg = caseStudy?.pertinentNegatives[0].pertinentNegativeObject?.pertinentNegative
  }
  // let firstKeywords = caseStudy?.pertinentPositives[0].pertinentPositiveObject?.unlockKeywords
  let firstPertNegKeywords = []
  if (caseStudy.pertinentNegatives.length > 0) {
    firstPertNegKeywords = caseStudy?.pertinentNegatives[0].pertinentNegativeObject?.unlockKeywords.split(", ")
    console.log("first pert neg", firstPertNegKeywords)
  }

  let secondPertNeg = null
  if (caseStudy.pertinentNegatives.length > 1) {
      secondPertNeg = caseStudy?.pertinentNegatives[1].pertinentNegativeObject?.pertinentNegative
    }

  let secondPertNegKeywords = []
  if (caseStudy.pertinentNegatives.length > 1) {
    secondPertNegKeywords = caseStudy?.pertinentNegatives[1].pertinentNegativeObject?.unlockKeywords.split(", ")
    console.log(secondPertNegKeywords)
  }

  let thirdPertNeg = null
  if (caseStudy.pertinentNegatives.length > 2) {
      thirdPertNeg = caseStudy?.pertinentNegatives[2].pertinentNegativeObject?.pertinentNegative
    }

  let thirdPertNegKeywords = []
  if (caseStudy.pertinentNegatives.length > 2) {
    thirdPertNegKeywords = caseStudy?.pertinentNegatives[2].pertinentNegativeObject?.unlockKeywords.split(", ")
    console.log(thirdPertNegKeywords)
  }

  let fourthPertNeg = null
  if (caseStudy.pertinentNegatives.length > 3) {
      fourthPertNeg = caseStudy?.pertinentNegatives[3].pertinentNegativeObject?.pertinentNegative
    }

  let fourthPertNegKeywords = []
  if (caseStudy.pertinentNegatives.length > 3) {
    fourthPertNegKeywords = caseStudy?.pertinentNegatives[3].pertinentNegativeObject?.unlockKeywords.split(", ")
    console.log(fourthPertNegKeywords)
  }

  let fifthPertNeg = null
  if (caseStudy.pertinentNegatives.length > 4) {
      fifthPertNeg = caseStudy?.pertinentNegatives[4].pertinentNegativeObject?.pertinentNegative
    }

  let fifthPertNegKeywords = []
  if (caseStudy.pertinentNegatives.length > 4) {
    fifthPertNegKeywords = caseStudy?.pertinentNegatives[4].pertinentNegativeObject?.unlockKeywords.split(", ")
    console.log(fifthPertNegKeywords)
  }

  // the N denotes that this is a pertinent NEGATIVE conditional response
  let conditionalResponse1N = false
  let conditionalResponse2N = false
  let conditionalResponse3N = false
  let conditionalResponse4N = false
  let conditionalResponse5N = false


    if (req.body.question.includes((`${firstPertNeg}`)) || (firstPertNegKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse1N = true
      console.log("conditional response neg now true")
    }

    firstPertNegKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse1N = true
          console.log("keyword for perNeg present")
        }
    })

  
    if (req.body.question.includes((`${secondPertNeg}`)) || (secondPertNegKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse2N = true
      console.log("conditional response now true")
    }

    secondPertNegKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse2N = true
          console.log("keyword for perNeg present")
        }
    })


    if (req.body.question.includes((`${thirdPertNeg}`)) || (thirdPertNegKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse3N = true
      console.log("conditional response now true")
    }

    thirdPertNegKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse3N = true
          console.log("keyword for perNeg present")
        }
    })

    if (req.body.question.includes((`${fourthPertNeg}`)) || (fourthPertNegKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse4N = true
      console.log("conditional response now true")
    }

    fourthPertNegKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse4N = true
          console.log("keyword for perNeg present")
        }
    })

    if (req.body.question.includes((`${fifthPertNeg}`)) || (fifthPertNegKeywords.some(v => req.body.question.includes(`${v}`)))) {
      conditionalResponse5N = true
      console.log("conditional response now true")
    }

    fifthPertNegKeywords.forEach((item) => {
        if (req.body.question.includes(item)) {
          conditionalResponse5N = true
          console.log("keyword for perNeg present")
        }
    })
  

  // now, evaluate conditional responses:

  if (conditionalResponse1 === true) {
    // conditionalResponse1 = false // now reset to false again
    console.log("now giving conditional response 1")
    console.log("conditional response now false: ", conditionalResponse1)
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of the symptoms you are having: ${firstPertPos}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions asked by the clinician and responses from you from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse1N === true) {
    conditionalResponse1N = false // now reset to false again
    console.log("conditional response now false: ", conditionalResponse1N)
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of pertinent negative symptoms you are not having: ${firstPertNeg}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions asked by the clinician and responses from you from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse2 === true) {
    // conditionalResponse2 = false // now reset to false again
    console.log("now giving conditional response 2")
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of the symptoms you are having: ${secondPertPos}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions and responses from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse2N === true) {
    conditionalResponse2N = false // now reset to false again
    console.log("conditional response now false: ", conditionalResponse2N)
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of pertinent negative symptoms you are not having: ${secondPertNeg}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions asked by the clinician and responses from you from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse3 === true) {
    // conditionalResponse3 = false // now reset to false again
    console.log("now giving conditional response 3")
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of the symptoms you are having: ${thirdPertPos}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions and responses from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse3N === true) {
    conditionalResponse3N = false // now reset to false again
    console.log("conditional response now false: ", conditionalResponse3N)
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of pertinent negative symptoms you are not having: ${thirdPertNeg}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions asked by the clinician and responses from you from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse4 === true) {
    // conditionalResponse4 = false // now reset to false again
    console.log("now giving conditional response 4")
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of the symptoms you are having: ${fourthPertPos}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions and responses from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse4N === true) {
    conditionalResponse4N = false // now reset to false again
    console.log("conditional response now false: ", conditionalResponse4N)
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of pertinent negative symptoms you are not having: ${fourthPertNeg}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions asked by the clinician and responses from you from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse5 === true) {
    // conditionalResponse5 = false // now reset to false again
    console.log("now giving conditional response 5")
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of the symptoms you are having: ${fifthPertPos}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions and responses from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else if (conditionalResponse5N === true) {
    conditionalResponse5N = false // now reset to false again
    console.log("conditional response now false: ", conditionalResponse5N)
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. Here is a summary of pertinent negative symptoms you are not having: ${fifthPertNeg}. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions asked by the clinician and responses from you from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response})
  } else {
    //no conditional response
    console.log(req.body.interactions)
    console.log("response is default - no conditional responses met")
    const response = await openAI.sendOpenAI(`Pretend as if you were a patient with the following symptoms: ${caseStudy.initialSymptoms}. You are being examined by a clinician trying to diagnose your condition. As the patient, respond to the following question from the clinician: ${req.body.question}. Limit response to 3 sentences max. Prior questions and responses from this dialogue are logged here: ${req.body.interactions}`)
    res.status(200).json({response, irrelevantQuestion: true})

  
    // ORIGINAL PROMPT, commented out below:
    // const response = await openAI.sendOpenAI(`Pretend as if you were a patient with ${caseStudy.primaryIllness} being examined by a clinician trying to diagnose your condition. Here are some supporting symptoms of your primary illness: ${caseStudy.supporting}. Additionally, here are some unsupporting symptoms of your primary illness: ${caseStudy.unsupporting}. As the patient, respond to the following question from the clinician: ${req.body.question}`)
    // res.status(200).json({response})
  }

  }catch(err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
  
  // console.log({response})
  
}
