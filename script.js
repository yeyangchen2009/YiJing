// 全局变量声明
let hexagrams = null;
const modalOverlay = document.getElementById('modalOverlay');
const hexagramCard = document.getElementById('hexagramCard');
const closeBtn = document.getElementById('closeBtn');
const hexagramList = document.getElementById('hexagramList');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeHexagramApp);

function initializeHexagramApp() {
    console.log('DOMContentLoaded fired - initializing application');

    // 验证DOM元素
    if (!modalOverlay || !hexagramCard || !closeBtn || !hexagramList) {
        console.error('Critical DOM elements missing:', {
            modalOverlay: !!modalOverlay,
            hexagramCard: !!hexagramCard,
            closeBtn: !!closeBtn,
            hexagramList: !!hexagramList
        });
        return;
    }

    // 从JSON文件加载数据
    fetch('zy.json')
        .then(response => response.json())
        .then(data => {
            console.log('Successfully loaded hexagram data');
            hexagrams = data.六十四卦;
            generateHexagramList();
            bindEventListeners();
        })
        .catch(error => {
            console.error('Failed to load hexagram data:', error);
            alert('加载卦象数据失败，请刷新页面重试');
        });
}

// 生成卦列表
function generateHexagramList() {
    console.log('Generating hexagram list with', hexagrams?.length || 0, 'items');
    hexagramList.innerHTML = '';

    if (!hexagrams || !Array.isArray(hexagrams)) {
        console.error('Hexagrams data is missing or not an array');
        return;
    }

    hexagrams.forEach((hexagram, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'hexagram-item';
        listItem.dataset.index = index;
        listItem.innerHTML = `
            <div class="list-hexagram-img">
                ${hexagram.爻画.map(yao => `<div class="yao-row ${yao === '_1' ? 'yang-line' : 'yin-line'}"></div>`).join('')}
            </div>
            <div class="hexagram-name">${hexagram.卦象结构}</div>
        `;
        hexagramList.appendChild(listItem);
    });
}

// 绑定所有事件监听器
function bindEventListeners() {
    // 卦象项点击事件
    hexagramList.addEventListener('click', (e) => {
        const item = e.target.closest('.hexagram-item');
        if (item) {
            const index = parseInt(item.dataset.index);
            console.log('Hexagram item clicked, index:', index);
            if (!isNaN(index) && hexagrams && hexagrams[index]) {
                openModal(hexagrams[index]);
            }
        }
    });

    // 关闭按钮事件
    closeBtn.addEventListener('click', closeModal);

    // 模态框外部点击事件
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// 打开模态框并填充数据
function openModal(hexagram) {
    console.log('Opening modal for hexagram:', hexagram);

    // 填充卦象结构
    const cardTitle = hexagramCard.querySelector('.card-title');
    if (cardTitle) cardTitle.textContent = hexagram.卦象结构;

    // 填充上卦和下卦
    const trigramLabels = hexagramCard.querySelectorAll('.trigram-label');
    if (trigramLabels.length >= 2) {
        trigramLabels[0].textContent = `上卦：${hexagram.上卦}`;
        trigramLabels[1].textContent = `下卦：${hexagram.下卦}`;
    }

    // 填充爻画
    const yaoContainer = hexagramCard.querySelector('.hexagram-card-image');
    if (yaoContainer) {
        yaoContainer.innerHTML = '';
        hexagram.爻画.forEach(yao => {
            const yaoRow = document.createElement('div');
            yaoRow.className = `yao-row ${yao === '_1' ? 'yang-line' : 'yin-line'}`;
            yaoContainer.appendChild(yaoRow);
        });
    }

    // 填充卦辞和彖曰
    const textContents = hexagramCard.querySelectorAll('.text-content');
    if (textContents.length >= 2) {
        textContents[0].textContent = hexagram.卦辞 || '无卦辞';
        textContents[1].textContent = hexagram.彖曰 || '无彖曰';
    }

    // 填充爻辞表格
    const tbody = hexagramCard.querySelector('.yao-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        if (hexagram.爻辞与小象 && Array.isArray(hexagram.爻辞与小象)) {
            hexagram.爻辞与小象.forEach(yaoCi => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${yaoCi.爻辞 || ''}</td>
                    <td>${yaoCi.小象 || ''}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // 更新页脚卦序号
    const cardFooter = hexagramCard.querySelector('.card-footer');
    if (cardFooter) {
        cardFooter.textContent = `《周易》六十四卦详解 - 第${hexagram.序号}卦`;
    }

    // 显示模态框
    modalOverlay.style.display = 'flex';
}

// 关闭模态框
function closeModal() {
    modalOverlay.style.display = 'none';
}
