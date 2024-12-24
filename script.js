function proceedToStep2() {
    const numCandidates = document.getElementById('numCandidates').value;
    const numVoters = document.getElementById('numVoters').value;
    
    if (numCandidates && numVoters) {
        localStorage.setItem('numCandidates', numCandidates);
        localStorage.setItem('numVoters', numVoters);
        localStorage.setItem('currentVoter', 0);
        localStorage.setItem('voterIds', JSON.stringify([])); // Initialize voter IDs list
        window.location.href = 'candidates.html';
    } else {
        alert('Please enter both numbers.');
    }
}

function submitCandidates() {
    const numCandidates = localStorage.getItem('numCandidates');
    const candidates = [];
    for (let i = 1; i <= numCandidates; i++) {
        candidates.push(document.getElementById(`candidate${i}`).value);
    }
    
    if (candidates.length === parseInt(numCandidates)) {
        localStorage.setItem('candidates', JSON.stringify(candidates));
        window.location.href = 'vote.html';
    } else {
        alert('Please enter names for all candidates.');
    }
}

function loadCandidatesForm() {
    const numCandidates = localStorage.getItem('numCandidates');
    const candidatesListDiv = document.getElementById('candidatesList');

    for (let i = 1; i <= numCandidates; i++) {
        candidatesListDiv.innerHTML += `
            <label for="candidate${i}">Candidate ${i} Name:</label>
            <input type="text" id="candidate${i}" name="candidate${i}" required><br><br>
        `;
    }
}

function proceedToVoting() {
    const voterId = document.getElementById('voterId').value;
    const voterIds = JSON.parse(localStorage.getItem('voterIds'));

    if (voterId) {
        if (voterIds.includes(voterId)) {
            alert('This voter ID has already been used to vote.');
            return;
        }

        const currentVoter = parseInt(localStorage.getItem('currentVoter'));
        const numVoters = parseInt(localStorage.getItem('numVoters'));

        if (currentVoter < numVoters) {
            voterIds.push(voterId);
            localStorage.setItem('voterIds', JSON.stringify(voterIds));
            localStorage.setItem('currentVoter', currentVoter + 1);
            document.getElementById('idForm').style.display = 'none';
            document.getElementById('voteForm').style.display = 'block';
        } else {
            alert('All voters have voted.');
            window.location.href = 'results.html';
        }
    } else {
        alert('Please enter your voter ID.');
    }
}

function loadVoteForm() {
    const candidates = JSON.parse(localStorage.getItem('candidates'));
    const candidatesOptionsDiv = document.getElementById('candidatesOptions');
    candidates.forEach((candidate, index) => {
        candidatesOptionsDiv.innerHTML += `
            <input type="radio" id="vote${index}" name="vote" value="${candidate}" required>
            <label for="vote${index}">${candidate}</label><br>
        `;
    });

    const votingEndTime = new Date().getTime() + 5 * 60 * 1000; // Voting ends in 5 minutes
    const timerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        const now = new Date().getTime();
        const distance = votingEndTime - now;

        if (distance < 0) {
            document.getElementById('timer').innerHTML = "Voting time has ended.";
            document.getElementById('voteForm').style.display = 'none';
            clearInterval(timerInterval);
            setTimeout(() => { window.location.href = 'results.html'; }, 2000);
            return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('timer').innerHTML = `${minutes}m ${seconds}s`;
    }
}

function submitVote() {
    const selectedVote = document.querySelector('input[name="vote"]:checked');
    if (selectedVote) {
        const voteCount = JSON.parse(localStorage.getItem('voteCount') || '{}');
        voteCount[selectedVote.value] = (voteCount[selectedVote.value] || 0) + 1;
        localStorage.setItem('voteCount', JSON.stringify(voteCount));

        alert('Vote submitted successfully. Next voter, please enter your ID.');

        document.getElementById('idForm').style.display = 'block';
        document.getElementById('voteForm').style.display = 'none';
        document.getElementById('voterId').value = '';
    } else {
        alert('Please select a candidate.');
    }
}

function loadResults() {
    const voteCount = JSON.parse(localStorage.getItem('voteCount') || '{}');
    let resultsHtml = '<h2>Results:</h2><ul>';
    for (const candidate in voteCount) {
        resultsHtml += `<li>${candidate}: ${voteCount[candidate]} votes</li>`;
    }
    resultsHtml += '</ul>';

    document.getElementById('results').innerHTML = resultsHtml;
}

// Load dynamic content based on the page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('candidatesList')) {
        loadCandidatesForm();
    }
    if (document.getElementById('candidatesOptions')) {
        loadVoteForm();
    }
    if (document.getElementById('results')) {
        loadResults();
    }
});
