package min.young.kim.resolver.common

import com.netflix.graphql.dgs.DgsComponent
import com.netflix.graphql.dgs.DgsQuery
import com.netflix.graphql.dgs.InputArgument
import min.young.kim.model.common.Code
import min.young.kim.repository.common.CommonRepository

@DgsComponent
class CodeDataFetcher(
    private val commonRepository: CommonRepository,
) {

    @DgsQuery
    fun codes(@InputArgument codeType: String): List<Code?>? = commonRepository.findByIdCodeType(codeType)

}