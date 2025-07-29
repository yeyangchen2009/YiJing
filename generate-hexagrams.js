const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const { existsSync } = require('fs');

// 配置路径
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const DATA_PATH = path.join(__dirname, 'zy.json');
const OUTPUT_DIR = path.join(__dirname, '64gua'); 

/**
 * 读取文件内容
 * @param {string} filePath 文件路径
 * @returns {Promise<string>} 文件内容
 */
async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`读取文件失败: ${filePath}`, error);
        throw error;
    }
}

/**
 * 确保输出目录存在
 * @param {string} dir 目录路径
 */
async function ensureDirectory(dir) {
    if (!existsSync(dir)) {
        await fs.mkdir(dir, { recursive: true });
    }
}

/**
 * 生成单个卦象HTML文件
 * @param {Object} hexagram 卦象数据
 * @param {Function} template 编译好的Handlebars模板
 */
async function generateSingleHexagram(hexagram, template) {
    try {
        // 渲染模板
        const htmlContent = template(hexagram);
        
        // 生成文件名（序号_卦名.html）
        const fileName = `${hexagram.序号}_${hexagram.卦名}.html`;
        const outputPath = path.join(OUTPUT_DIR, fileName);
        
        // 写入文件
        await fs.writeFile(outputPath, htmlContent);
        console.log(`已生成: ${fileName}`);
    } catch (error) {
        console.error(`生成卦象失败: ${hexagram.卦名}`, error);
    }
}

/**
 * 批量生成所有卦象
 */
async function generateAllHexagrams() {
    try {
        // 1. 读取模板和数据
        // 修复后的代码片段
        // 在读取模板前先读取并解析JSON数据
        const dataContent = await readFile(DATA_PATH);
        const hexagramsData = JSON.parse(dataContent).六十四卦;
        
        if (!hexagramsData || !Array.isArray(hexagramsData)) {
            console.error('数据格式错误：缺少有效的六十四卦数组');
            return;
        }
        
        // 然后继续读取模板内容
        const templateContent = await readFile(TEMPLATE_PATH);
        
        // 确保模板内容存在
        if (!templateContent) {
            console.error('模板文件读取失败');
            return;
        }
        
        // 验证模板变量
        if (!templateContent.includes('{{卦名}}')) {
            console.error('模板验证失败：缺少必要的模板变量{{卦名}}');
            return;
        }
        
        // 2. 编译模板
        const template = handlebars.compile(templateContent);
        
        // 3. 确保输出目录存在
        await ensureDirectory(OUTPUT_DIR);
        
        // 4. 批量生成卦象
        console.log(`开始生成${hexagramsData.length}个卦象...`);
        for (const hexagram of hexagramsData) {
            await generateSingleHexagram(hexagram, template);
        }
        
        console.log(`所有卦象已生成，保存路径: ${OUTPUT_DIR}`);
    } catch (error) {
        console.error('批量生成失败', error);
    }
}

// 执行生成
generateAllHexagrams();
    