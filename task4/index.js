const corsProxy = "http://localhost:8080/";
const inputUrl = "https://test-share.shub.edu.vn/api/intern-test/input";
const outputUrl = "https://test-share.shub.edu.vn/api/intern-test/output";

document.getElementById('submit').addEventListener('click', async e => {
    e.preventDefault();

    try {
        const res = await fetch(corsProxy + inputUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const dataJSON = await res.json();
        console.log(dataJSON)
        
        const dataArray = dataJSON.data;
        const n = dataArray.length;

        const prefixSum = new Array(n + 1).fill(0);
        const prefixEven = new Array(n + 1).fill(0);
        const prefixOdd = new Array(n + 1).fill(0);

        for (let i = 0; i < n; i++) {
            prefixSum[i + 1] = prefixSum[i] + dataArray[i];
            if (i % 2 === 0) {
                prefixEven[i + 1] = prefixEven[i] + dataArray[i];
                prefixOdd[i + 1] = prefixOdd[i];
            } else {
                prefixOdd[i + 1] = prefixOdd[i] + dataArray[i];
                prefixEven[i + 1] = prefixEven[i];
            }
        }

        const resultType1 = [];
        const resultType2 = [];

        dataJSON.query.forEach(query => {
            const [l, r] = query.range;
            let result;

            if (query.type === "1") {
                result = prefixSum[r + 1] - prefixSum[l];
                resultType1.push(result); 
            } else if (query.type === "2") {
                const evenSum = prefixEven[r + 1] - prefixEven[l];
                const oddSum = prefixOdd[r + 1] - prefixOdd[l];
                result = evenSum - oddSum;
                resultType2.push(result); 
            }
        });

    
        const output = [...resultType1, ...resultType2];

        const outputRes = await fetch(corsProxy + outputUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dataJSON.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(output)
        });

        if (!outputRes.ok) {
            throw new Error(`HTTP POST error! status: ${outputRes.status}`);
        }

        const outputJson = await outputRes.json();
        console.log("Response from output POST:", outputJson);

    } catch (error) {
        console.error("Error:", error);
    }
});
