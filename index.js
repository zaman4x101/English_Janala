// Global variable to store all words from the currently selected lesson
let allWords = [];

// 1. Function to load all available lessons from the API
const LoadLessons = () => { // 1
    const loadUrl = "https://openapi.programming-hero.com/api/levels/all";
    fetch(loadUrl).then(res => res.json()).then(json => displayLessons(json.data));
}

// 4. Function to load words for a specific lesson level
const loadlevelWord = (id) => { // 4
    console.log(`level-${id}`);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    // Hide placeholder, show word container with spinner
    document.getElementById('placeholder').classList.add('hidden');
    const wordContainer = document.getElementById('word-container');
    wordContainer.classList.remove('hidden');
    wordContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-24 w-full">
            <span class="loading loading-dots loading-lg text-primary"></span>
            <p class="mt-4 font-medium text-primary/70 animate-pulse">Loading Vocabulary...</p>
        </div>
    `;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            allWords = data.data; // Save fetched words globally so search works
            // Clear the search input whenever a new lesson loads
            document.getElementById('search-input').value = '';
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            if (clickBtn) clickBtn.classList.add('active');
            displayLevelWord(allWords);
        });
};

// Function to remove active class from all lesson buttons
const removeActive = () => {
    const activeBtns = document.querySelectorAll('.lesson-btn');
    activeBtns.forEach(activeBtn => activeBtn.classList.remove('active'));
}

// Function to display the words in card format
const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    if (!words || words.length === 0) {
        wordContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-10">
                <div class="mb-3"><i class="fa-solid fa-triangle-exclamation fa-2xl" style="color: rgb(0, 0, 0);"></i></div>
                <p class="hindSiliguri">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-2xl font-bold mt-2 hindSiliguri text-[#18181B]/80">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        return;
    }

    words.forEach(word => {
        const card = document.createElement('div');
        card.className = "h-full";
        card.innerHTML = `
            <div class="bg-white p-6 md:p-8 text-center rounded-3xl shadow-sm h-full flex flex-col justify-between">
                <div>
                    <h2 class="text-2xl font-bold mb-3 break-words">${word.word || "Word not found"}</h2>
                    <p class="text-xs uppercase tracking-wide text-gray-500 font-medium mb-1">Meaning/Pronunciation</p>
                    <p class="text-lg md:text-xl font-semibold mb-5 text-[#18181B]/80 hindSiliguri break-words">
                        ${word.meaning || "পাওয়া যায় নি"} / ${word.pronunciation || "উচ্চারণ পাওয়া যায় নি"}
                    </p>
                </div>
                <div class="flex justify-between items-center mt-auto">
                    <button onclick="loadWordDetail(${word.id})" class="bg-[#1A91FF]/10 hover:bg-[#1A91FF]/20 rounded-xl h-12 w-12 flex justify-center items-center transition-colors">
                        <i class="fa-solid fa-circle-exclamation fa-xl" style="color: rgb(0, 0, 0);"></i>
                    </button>
                    <button class="bg-[#1A91FF]/10 hover:bg-[#1A91FF]/20 rounded-xl h-12 w-12 flex justify-center items-center transition-colors">
                        <i class="fa-solid fa-volume-high fa-xl" style="color: rgb(0, 0, 0);"></i>
                    </button>
                </div>
            </div>
        `;
        wordContainer.append(card);
    });
}

// 6. Function to load detailed information for a specific word
const loadWordDetail = async (id) => { // 6
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayLoadWordDetail(details.data);
}

// Function to display word details in the modal
const displayLoadWordDetail = (word) => {
    const modalBox = document.getElementById('wordDetailContainer');

    let synonymButtons = '';
    word.synonyms.forEach(syn => {
        synonymButtons += `<button class="bg-[#EDF7FF] px-5 py-1 rounded-md m-1">${syn}</button>`;
    });

    modalBox.innerHTML = `
        <div class="w-full rounded-md border-sky-200 border-1 p-5">
            <h2 class="text-2xl font-bold mb-3">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
            <p class="text-md font-semibold mb-1">Meaning</p>
            <p class="text-sm font-medium mb-3">${word.meaning}</p>
            <p class="text-md font-semibold mb-1">Example</p>
            <p class="text-sm font-medium mb-4">${word.sentence}</p>
            <p class="text-md font-semibold mb-2">সমার্থক শব্দ গুলো</p>
            <div class="flex flex-wrap gap-2">
                ${synonymButtons}
            </div>
        </div>
    `;

    document.getElementById('my_modal_5').showModal();
}

// 3. Function to display lesson buttons
const displayLessons = (lessons) => { // 3
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = "";
    for (const lesson of lessons) {
        console.log(lesson);
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadlevelWord(${lesson.level_no})"
            class="btn btn-outline btn-primary flex-1 min-w-[120px] max-w-[150px] lesson-btn">
                <i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}
            </button>
        `;
        levelContainer.append(btnDiv);
    }
}

// Function to search words in the current lesson
const searchWord = () => {
    const value = document.getElementById('search-input').value.toLowerCase().trim();

    // Only search if a lesson has been loaded
    if (allWords.length === 0) return;

    const filteredWords = allWords.filter(item =>
        item.word.toLowerCase().includes(value)
    );

    displayLevelWord(filteredWords);
};

// 2. Initial call to load lessons when the page loads
LoadLessons(); // 2, initial call